/**
 * solver.js
 * Main dynamic schedule solver
 */

window.solver = (function() {

    /**
     * Solve the schedule given the current state and day boundaries
     * @param {Number} dayStart - in minutes
     * @param {Number} dayEnd - in minutes
     */
    function solveSchedule(dayStart, dayEnd) {
        const originalSchedule = window.state.getCurrentSchedule();
        const scheduleCopy = utils.deepCopy(originalSchedule);

        // Lock past activities
        const currentTime = window.state.getCurrentTimeMinutes();
        window.realtime.applyTimeLocks(scheduleCopy, currentTime);

        // Identify mutable activities
        const mutableActivities = scheduleCopy.filter(a => !a.locked && a.flexible);

        if (mutableActivities.length === 0) {
            console.log("No activities can be adjusted.");
            return;
        }

        // Generate candidate schedules
        const candidates = window.search.generateCandidates(scheduleCopy, dayStart, dayEnd);

        if (candidates.length === 0) {
            console.warn("No valid schedule solution found!");
            window.apply.applySchedule(scheduleCopy);
            return;
        }

        // Score candidates
        const { bestSchedule, bestScore } = window.scoring.selectBestSchedule(originalSchedule, candidates);

        // Apply best schedule
        window.apply.applySchedule(bestSchedule);

        console.log(`Applied best schedule with score ${bestScore}`);
    }

    return {
        solveSchedule
    };

})();
