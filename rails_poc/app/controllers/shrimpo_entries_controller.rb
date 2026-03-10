# frozen_string_literal: true

# NOTE: CSRF protection is enabled via ApplicationController's
# `protect_from_forgery with: :exception` call (standard in Rails).
# The `shrimpo-vote` web component reads the CSRF token from the page meta tag
# and includes it in the X-CSRF-Token header on fetch requests.
class ShrimpoEntriesController < ApplicationController
  protect_from_forgery with: :exception
  layout "hotwire"

  before_action :set_shrimpo
  before_action :set_entry, only: [:show]

  # GET /shrimpos/:shrimpo_slug/entries/:slug
  # Shows a single shrimpo entry with playback, voting, and comments.
  # Equivalent to the Ember home/shrimpos/entries/show route.
  def show
    @existing_vote = if user_signed_in?
      @entry.shrimpo_votes.find_by(user: current_user)
    end
  end

  # POST /shrimpos/:shrimpo_slug/entries
  # Handles submitting a new entry to a running shrimpo.
  # The audio file is uploaded via Active Storage direct upload.
  def create
    @entry = @shrimpo.shrimpo_entries.new(entry_params)
    @entry.user = current_user

    if @entry.save
      redirect_to shrimpo_path(@shrimpo.slug),
                  notice: "Entry submitted successfully!"
    else
      render :new, status: :unprocessable_entity
    end
  end

  private

  def set_shrimpo
    @shrimpo = Shrimpo.find_by!(slug: params[:shrimpo_slug])
  end

  def set_entry
    @entry = @shrimpo.shrimpo_entries.includes(
      :user,
      :shrimpo_votes,
      :shrimpo_voting_categories,
      :shrimpo_voting_category_scores,
      :trophy_awards,
      :posts
    ).find_by!(slug: params[:slug])
  end

  def entry_params
    params.require(:shrimpo_entry).permit(:title, :description, :audio, :cc_license_accepted)
  end
end
