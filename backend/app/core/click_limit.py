from datetime import UTC, datetime, timedelta

from app.core.constants import CLICK_RESTORE_AMOUNT, CLICK_RESTORE_HOURS, MAX_CLICKS
from app.models.player_state import PlayerState


def refresh_click_limit_if_needed(player_state: PlayerState) -> None:
    now = datetime.now(UTC)
    last_restore = player_state.last_click_restore_at

    restore_interval = timedelta(hours=CLICK_RESTORE_HOURS)
    time_passed = now - last_restore

    completed_intervals = int(time_passed.total_seconds() // restore_interval.total_seconds())

    if completed_intervals <= 0:
        return

    clicks_to_add = completed_intervals * CLICK_RESTORE_AMOUNT
    player_state.clicks_left = min(MAX_CLICKS, player_state.clicks_left + clicks_to_add)
    player_state.last_click_restore_at = last_restore + restore_interval * completed_intervals


def add_clicks_with_cap(player_state: PlayerState, amount: int) -> int:
    old_value = player_state.clicks_left
    player_state.clicks_left = min(MAX_CLICKS, player_state.clicks_left + amount)
    return player_state.clicks_left - old_value


def refresh_daily_damage_boost(player_state: PlayerState) -> None:
    if not player_state.daily_damage_boost_active:
        return

    if player_state.daily_damage_boost_expires_at is None:
        player_state.daily_damage_boost_active = False
        return

    now = datetime.now(UTC)
    if now >= player_state.daily_damage_boost_expires_at:
        player_state.daily_damage_boost_active = False
        player_state.daily_damage_boost_expires_at = None