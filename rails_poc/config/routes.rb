# frozen_string_literal: true

# Routes for the Shrimpos Hotwire proof of concept.
#
# Add these to the streampusher-api config/routes.rb.
# These routes serve full HTML pages (not JSON API) using the "hotwire" layout,
# which keeps the audio player and background visuals alive across navigations
# via Turbo Drive + data-turbo-permanent.

Rails.application.routes.draw do
  # Shrimpos listing and detail pages
  resources :shrimpos, only: [:index, :show], param: :slug do
    # Nested shrimpo entries
    resources :shrimpo_entries, only: [:show, :create], param: :slug, path: "entries" do
      # Votes for an entry (submitted by the shrimpo-vote web component)
      resources :shrimpo_votes, only: [:create], path: "votes"
    end

    # Host-only action to tally results and end the shrimpo
    member do
      post :end_shrimpo
    end
  end
end
