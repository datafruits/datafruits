# frozen_string_literal: true

# NOTE: CSRF protection is enabled via ApplicationController's
# `protect_from_forgery with: :exception` call (standard in Rails).
# The layout includes <%= csrf_meta_tags %> and all forms use Rails helpers
# that include the authenticity token automatically.
class ShrimposController < ApplicationController
  protect_from_forgery with: :exception
  layout "hotwire"

  before_action :set_shrimpo, only: [:show]

  # GET /shrimpos
  # Lists all shrimpos, grouped by status (in progress vs completed).
  # Equivalent to the Ember home/shrimpos route.
  def index
    @shrimpos = Shrimpo.includes(:user, :shrimpo_entries)
                       .order(created_at: :desc)

    @current_shrimpos = @shrimpos.select { |s| %w[running voting].include?(s.status) }
    @completed_shrimpos = @shrimpos.select { |s| s.status == "completed" }
                                   .sort_by { |s| -(s.ended_at&.to_i || 0) }
  end

  # GET /shrimpos/:slug
  # Shows a single shrimpo with its entries, voting, and comments.
  # Equivalent to the Ember home/shrimpos/show route.
  def show
    @shrimpo_entry = if user_signed_in?
      # Find the current user's existing entry (if any) or prepare a new one.
      existing_entry = @shrimpo.shrimpo_entries.find_by(user: current_user)
      if existing_entry && !@shrimpo.multi_submit_allowed?
        existing_entry
      else
        @shrimpo.shrimpo_entries.new(user: current_user)
      end
    end
  end

  private

  def set_shrimpo
    @shrimpo = Shrimpo.includes(
      :user,
      :posts,
      :shrimpo_voting_categories,
      shrimpo_entries: [:user, :shrimpo_votes, :shrimpo_voting_category_scores, :trophy_awards]
    ).find_by!(slug: params[:slug])
  end
end
