#!/usr/bin/env ruby
# frozen_string_literal: true

# Shrimpo Video Generator
# Generates YouTube-ready videos from datafruits shrimpo tracks using ffmpeg.
#
# Each video features:
#   - A scrolling repeating texture background (randomly picked from textures/)
#   - The user's avatar displayed prominently
#   - An audio waveform/spectrum visualization
#   - Track title and artist name overlay
#
# Usage:
#   ruby generate_video.rb --audio track.mp3 --avatar avatar.png --title "Track Name" --artist "DJ Name"
#   ruby generate_video.rb --url https://datafruits.fm/shrimpos/fall-fruix-2025/entry/cannery-jam
#
# Requirements:
#   - Ruby 3.0+
#   - ffmpeg (built with --enable-libfreetype for drawtext)
#   - ffprobe (comes with ffmpeg)

require "optparse"
require "open-uri"
require "fileutils"
require "json"
require "net/http"
require "uri"
require "tmpdir"
require "shellwords"

module ShrimpoVideoGenerator
  # Video output settings optimized for YouTube
  VIDEO_WIDTH       = 1920
  VIDEO_HEIGHT      = 1080
  VIDEO_FPS         = 30
  VIDEO_BITRATE     = "5M"
  AUDIO_BITRATE     = "192k"
  AUDIO_SAMPLE_RATE = 44_100

  # Layout constants
  AVATAR_SIZE       = 300
  AVATAR_X          = 810  # centered: (1920 - 300) / 2
  AVATAR_Y          = 180
  AVATAR_BORDER     = 8

  # Visualization settings
  VIZ_WIDTH         = 1200
  VIZ_HEIGHT        = 200
  VIZ_X             = 360  # centered: (1920 - 1200) / 2
  VIZ_Y             = 700

  # Text settings
  TITLE_Y           = 540
  ARTIST_Y          = 600
  FONT_SIZE_TITLE   = 48
  FONT_SIZE_ARTIST  = 36
  FONT_COLOR        = "white"
  FONT_BORDER_COLOR = "black"
  FONT_BORDER_WIDTH = 3

  # Background scroll speed (pixels per second)
  SCROLL_SPEED      = 50

  class Generator
    attr_reader :options, :work_dir

    def initialize(options)
      @options = options
      @work_dir = Dir.mktmpdir("shrimpo-video-")
      at_exit { FileUtils.rm_rf(@work_dir) unless options[:keep_tmp] }
    end

    def generate!
      validate_dependencies!
      prepare_inputs!
      duration = detect_audio_duration
      texture_path = select_texture
      build_video(duration, texture_path)
      log "✅ Video generated: #{output_path}"
    end

    private

    def validate_dependencies!
      %w[ffmpeg ffprobe].each do |cmd|
        unless system("which #{cmd} > /dev/null 2>&1")
          abort "Error: '#{cmd}' is required but not found in PATH. Please install ffmpeg."
        end
      end
    end

    def prepare_inputs!
      @audio_path = resolve_file(options[:audio], "audio")
      @avatar_path = resolve_file(options[:avatar], "avatar")

      # Prepare avatar: resize to square with rounded corners
      prepared_avatar = File.join(work_dir, "avatar_prepared.png")
      run_ffmpeg_cmd(
        "ffmpeg", "-y",
        "-i", @avatar_path,
        "-vf", "scale=#{AVATAR_SIZE}:#{AVATAR_SIZE}:force_original_aspect_ratio=decrease," \
               "pad=#{AVATAR_SIZE}:#{AVATAR_SIZE}:(ow-iw)/2:(oh-ih)/2:color=0x00000000," \
               "format=rgba",
        prepared_avatar
      )
      @avatar_path = prepared_avatar
    end

    def resolve_file(path_or_url, label)
      if path_or_url =~ %r{\Ahttps?://}
        log "Downloading #{label} from #{path_or_url}..."
        ext = File.extname(URI.parse(path_or_url).path)
        ext = ".png" if ext.empty? && label == "avatar"
        ext = ".mp3" if ext.empty? && label == "audio"
        local = File.join(work_dir, "#{label}#{ext}")
        download_file(path_or_url, local)
        local
      else
        abort "Error: #{label} file not found: #{path_or_url}" unless File.exist?(path_or_url)
        path_or_url
      end
    end

    def download_file(url, dest)
      uri = URI.parse(url)
      response = Net::HTTP.start(uri.host, uri.port, use_ssl: uri.scheme == "https") do |http|
        request = Net::HTTP::Get.new(uri)
        http.request(request)
      end

      case response
      when Net::HTTPSuccess
        File.binwrite(dest, response.body)
      when Net::HTTPRedirection
        download_file(response["location"], dest)
      else
        abort "Error: Failed to download #{url} (HTTP #{response.code})"
      end
    end

    def detect_audio_duration
      output = `ffprobe -v quiet -show_entries format=duration -of csv=p=0 #{Shellwords.escape(@audio_path)}`.strip
      duration = output.to_f
      abort "Error: Could not detect audio duration" if duration <= 0
      log "Audio duration: #{duration.round(2)}s"
      duration
    end

    def select_texture
      texture_dir = options[:texture_dir] || File.join(__dir__, "textures")
      textures = Dir.glob(File.join(texture_dir, "*.{png,jpg,jpeg,gif}"))

      if textures.empty?
        log "No textures found in #{texture_dir}, generating a default gradient background"
        generate_default_background
      else
        selected = textures.sample
        log "Selected texture: #{File.basename(selected)}"
        selected
      end
    end

    def generate_default_background
      bg_path = File.join(work_dir, "default_bg.png")
      # Generate a dark gradient background with some visual interest
      run_ffmpeg_cmd(
        "ffmpeg", "-y",
        "-f", "lavfi",
        "-i", "color=c=0x1a0a2e:s=#{VIDEO_WIDTH}x#{VIDEO_HEIGHT}:d=1",
        "-vf", "drawbox=x=0:y=0:w=iw:h=ih/3:color=0x16213e@0.8:t=fill," \
               "drawbox=x=0:y=ih/3:w=iw:h=ih/3:color=0x0f3460@0.6:t=fill," \
               "drawbox=x=0:y=2*ih/3:w=iw:h=ih/3:color=0x533483@0.4:t=fill",
        "-frames:v", "1",
        bg_path
      )
      bg_path
    end

    def build_video(duration, texture_path)
      log "Building video (#{duration.round(1)}s)..."

      # Escape text for ffmpeg drawtext filter
      escaped_title = escape_drawtext(options[:title] || "Untitled Track")
      escaped_artist = escape_drawtext(options[:artist] || "Unknown Artist")
      escaped_shrimpo = escape_drawtext(options[:shrimpo_title] || "")

      # Build the complex ffmpeg filter graph
      filter_complex = build_filter_graph(
        duration: duration,
        title: escaped_title,
        artist: escaped_artist,
        shrimpo_title: escaped_shrimpo,
        texture_path: texture_path
      )

      cmd = [
        "ffmpeg", "-y",
        # Input 0: texture image for background
        "-loop", "1", "-i", texture_path,
        # Input 1: avatar image
        "-i", @avatar_path,
        # Input 2: audio file (also used for visualization)
        "-i", @audio_path,
        # Input 3: audio visualization via showwaves
        "-f", "lavfi",
        "-i", "amovie=#{Shellwords.escape(@audio_path)},asplit[ao][a1];" \
              "[a1]showwaves=s=#{VIZ_WIDTH}x#{VIZ_HEIGHT}:mode=cline:rate=#{VIDEO_FPS}" \
              ":colors=0xff69b4|0x00ff88|0xffdd57:scale=sqrt[vz];[ao]anullsink",
        # Filter complex
        "-filter_complex", filter_complex,
        # Map outputs
        "-map", "[vout]",
        "-map", "2:a",
        # Video encoding
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", "18",
        "-b:v", VIDEO_BITRATE,
        "-maxrate", VIDEO_BITRATE,
        "-bufsize", "10M",
        "-pix_fmt", "yuv420p",
        "-r", VIDEO_FPS.to_s,
        # Audio encoding
        "-c:a", "aac",
        "-b:a", AUDIO_BITRATE,
        "-ar", AUDIO_SAMPLE_RATE.to_s,
        # Duration
        "-t", duration.to_s,
        "-shortest",
        # Output
        output_path
      ]

      run_ffmpeg_cmd(*cmd)
    end

    def build_filter_graph(duration:, title:, artist:, shrimpo_title:, texture_path:)
      parts = []

      # Step 1: Create scrolling tiled background from texture
      # Tile the texture to fill the screen, then scroll it
      parts << "[0:v]scale=#{VIDEO_WIDTH}:#{VIDEO_HEIGHT}:force_original_aspect_ratio=increase," \
               "crop=#{VIDEO_WIDTH}:#{VIDEO_HEIGHT}," \
               "format=rgba[bg_single]"

      # Create a double-height version for scrolling
      parts << "[bg_single]split[bg1][bg2]"
      parts << "[bg1][bg2]vstack[bg_tall]"

      # Scroll the background vertically
      parts << "[bg_tall]crop=#{VIDEO_WIDTH}:#{VIDEO_HEIGHT}:" \
               "0:mod(#{SCROLL_SPEED}*t\\,#{VIDEO_HEIGHT})[bg]"

      # Step 2: Overlay avatar with a glow/border effect
      parts << "[1:v]scale=#{AVATAR_SIZE}:#{AVATAR_SIZE}," \
               "format=rgba[avatar_raw]"

      # Create a white border behind the avatar
      border_size = AVATAR_SIZE + (AVATAR_BORDER * 2)
      parts << "color=c=white:s=#{border_size}x#{border_size}:d=#{duration}," \
               "format=rgba[avatar_border]"

      parts << "[avatar_border][avatar_raw]overlay=" \
               "#{AVATAR_BORDER}:#{AVATAR_BORDER}[avatar]"

      # Step 3: Compose everything together
      avatar_x = AVATAR_X - AVATAR_BORDER
      avatar_y = AVATAR_Y - AVATAR_BORDER

      # Background + avatar
      parts << "[bg][avatar]overlay=#{avatar_x}:#{avatar_y}:shortest=1[with_avatar]"

      # Step 4: Add audio visualization overlay
      parts << "[3:v]format=rgba,colorkey=0x000000:similarity=0.3:blend=0.2[viz_alpha]"

      parts << "[with_avatar][viz_alpha]overlay=#{VIZ_X}:#{VIZ_Y}:shortest=1[with_viz]"

      # Step 5: Add text overlays
      text_filter = []

      # Track title
      text_filter << "drawtext=text='#{title}':" \
                     "fontsize=#{FONT_SIZE_TITLE}:" \
                     "fontcolor=#{FONT_COLOR}:" \
                     "borderw=#{FONT_BORDER_WIDTH}:" \
                     "bordercolor=#{FONT_BORDER_COLOR}:" \
                     "x=(w-text_w)/2:y=#{TITLE_Y}"

      # Artist name
      text_filter << "drawtext=text='#{artist}':" \
                     "fontsize=#{FONT_SIZE_ARTIST}:" \
                     "fontcolor=0xff69b4:" \
                     "borderw=#{FONT_BORDER_WIDTH - 1}:" \
                     "bordercolor=#{FONT_BORDER_COLOR}:" \
                     "x=(w-text_w)/2:y=#{ARTIST_Y}"

      # Shrimpo title (if provided)
      unless shrimpo_title.empty?
        text_filter << "drawtext=text='#{shrimpo_title}':" \
                       "fontsize=#{FONT_SIZE_ARTIST - 4}:" \
                       "fontcolor=0xffdd57:" \
                       "borderw=#{FONT_BORDER_WIDTH - 1}:" \
                       "bordercolor=#{FONT_BORDER_COLOR}:" \
                       "x=(w-text_w)/2:y=#{ARTIST_Y + 50}"
      end

      parts << "[with_viz]#{text_filter.join(",")}[vout]"

      parts.join(";\n")
    end

    def escape_drawtext(text)
      # ffmpeg drawtext requires escaping: \ ' : %
      text.gsub("\\", "\\\\\\\\")
          .gsub("'", "'\\\\\\''")
          .gsub(":", "\\:")
          .gsub("%", "\\%")
    end

    def output_path
      options[:output] || begin
        safe_title = (options[:title] || "shrimpo_video")
          .gsub(/[^a-zA-Z0-9_\-]/, "_")
          .gsub(/_+/, "_")
          .downcase
        "#{safe_title}.mp4"
      end
    end

    def run_ffmpeg_cmd(*cmd)
      log "Running: #{cmd.join(" ")}" if options[:verbose]
      unless system(*cmd, %i[out err] => options[:verbose] ? $stdout : File::NULL)
        abort "Error: ffmpeg command failed. Run with --verbose to see details."
      end
    end

    def log(message)
      $stderr.puts "[shrimpo-video] #{message}"
    end
  end

  class CLI
    def self.run(argv = ARGV)
      options = parse_options(argv)
      generator = Generator.new(options)
      generator.generate!
    end

    def self.parse_options(argv)
      options = {}

      parser = OptionParser.new do |opts|
        opts.banner = "Usage: ruby generate_video.rb [options]"
        opts.separator ""
        opts.separator "Generate YouTube-ready videos from datafruits shrimpo tracks."
        opts.separator ""
        opts.separator "Options:"

        opts.on("-a", "--audio FILE_OR_URL", "Path or URL to the audio file (required)") do |v|
          options[:audio] = v
        end

        opts.on("-i", "--avatar FILE_OR_URL", "Path or URL to the user's avatar image (required)") do |v|
          options[:avatar] = v
        end

        opts.on("-t", "--title TITLE", "Track title") do |v|
          options[:title] = v
        end

        opts.on("-r", "--artist ARTIST", "Artist/DJ name") do |v|
          options[:artist] = v
        end

        opts.on("-s", "--shrimpo-title TITLE", "Shrimpo event title") do |v|
          options[:shrimpo_title] = v
        end

        opts.on("-o", "--output FILE", "Output video file path (default: <title>.mp4)") do |v|
          options[:output] = v
        end

        opts.on("-d", "--texture-dir DIR", "Directory containing background textures") do |v|
          options[:texture_dir] = v
        end

        opts.on("-v", "--verbose", "Show ffmpeg output") do
          options[:verbose] = true
        end

        opts.on("--keep-tmp", "Don't clean up temporary files") do
          options[:keep_tmp] = true
        end

        opts.on("-h", "--help", "Show this help message") do
          puts opts
          exit
        end
      end

      parser.parse!(argv)

      unless options[:audio] && options[:avatar]
        $stderr.puts "Error: --audio and --avatar are required."
        $stderr.puts ""
        $stderr.puts parser
        exit 1
      end

      options
    end
  end
end

# Run the CLI when executed directly
ShrimpoVideoGenerator::CLI.run if $PROGRAM_NAME == __FILE__
