/**
 * apply.js
 * Apply solved schedule and update global state / UI
 */

window.apply = (function() {

    /**
     * Apply a candidate schedule to current state
     * @param {Array} candidateSchedule
     * @param {Boolean} updateUI - if true, will trigger rendering
     */
    function applySchedule(candidateSchedule, updateUI = true) {
        // Lock activities that have already finished
        const currentTime = window.state.getCurrentTimeMinutes();
        candidateSchedule.forEach(act => {
            if ((act.start + act.duration) <= currentTime) {
                act.locked = true;
            }
        });

        // Update global state
        window.state.setCurrentSchedule(candidateSchedule);

        // Optionally update UI
        if (updateUI && window.apply.renderSchedule) {
            window.apply.renderSchedule(candidateSchedule);
        }
    }

    /**
     * Render schedule to a table
     * Placeholder function: user can implement DOM rendering
     * @param {Array} schedule
     */
    function renderSchedule(schedule) {
        if (!document.getElementById('scheduleTable')) return;

        const table = document.getElementById('scheduleTable');
        table.innerHTML = '';

        schedule.forEach(act => {
            const row = document.createElement('tr');
            const lockedStr = act.locked ? ' (locked)' : '';
            row.innerHTML = `<td>${act.name}${lockedStr}</td>
                             <td>${utils.minutesToTimeString(act.start)}</td>
                             <td>${utils.minutesToDurationString(act.duration)}</td>`;
            table.appendChild(row);
        });
    }

    return {
        applySchedule,
        renderSchedule
    };

})();
