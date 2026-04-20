from datetime import datetime, UTC

from app.models.player_state import PlayerState


def refresh_click_limit_if_needed(player_state: PlayerState) -> None:
    now = datetime.now(UTC)
    last_reset = player_state.last_click_reset_at

    if last_reset.date() != now.date():
        player_state.clicks_left = player_state.daily_click_limit
        player_state.last_click_reset_at = now