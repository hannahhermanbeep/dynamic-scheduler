/**
 * utils.js
 * General helper functions for the dynamic classroom scheduler
 */

// Convert "HH:MM" string to minutes since midnight
function timeStringToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

// Convert minutes since midnight to "HH:MM" string
function minutesToTimeString(minutes) {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs.toString().padStart(2,'0')}:${mins.toString().padStart(2,'0')}`;
}

// Round minutes to nearest 5-minute increment
function roundToFive(minutes) {
    return Math.round(minutes / 5) * 5;
}

// Clamp a value between min and max
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

// Deep copy an object or array
function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// Swap elements in an array (used for drag-and-drop reordering)
function arraySwap(arr, index1, index2) {
    const temp = arr[index1];
    arr[index1] = arr[index2];
    arr[index2] = temp;
}

// Insert an element into an array at a specific index
function arrayInsert(arr, index, element) {
    arr.splice(index, 0, element);
}

// Remove an element from an array at a specific index
function arrayRemove(arr, index) {
    arr.splice(index, 1);
}

// Sum values in an array
function arraySum(arr, key) {
    return arr.reduce((acc, el) => acc + (el[key] || 0), 0);
}

// Sort array of activities by start time
function sortActivitiesByStart(activities) {
    activities.sort((a, b) => a.start - b.start);
}

// Return true if two ranges overlap [start1, end1], [start2, end2]
function rangesOverlap(start1, end1, start2, end2) {
    return start1 < end2 && start2 < end1;
}

// Generate a range of numbers from start to end (inclusive) in step increments
function range(start, end, step = 1) {
    const arr = [];
    for (let i = start; i <= end; i += step) arr.push(i);
    return arr;
}

// Compare two arrays of activities for equality (start & duration)
function activitiesEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i].start !== arr2[i].start || arr1[i].duration !== arr2[i].duration) {
            return false;
        }
    }
    return true;
}

// Convert minutes to human-readable duration string "1h 30m"
function minutesToDurationString(minutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    let str = '';
    if (h > 0) str += `${h}h `;
    if (m > 0) str += `${m}m`;
    return str.trim();
}

// Round a number to nearest multiple of step
function roundToStep(value, step) {
    return Math.round(value / step) * step;
}

// Export functions globally
window.utils = {
    timeStringToMinutes,
    minutesToTimeString,
    roundToFive,
    clamp,
    deepCopy,
    arraySwap,
    arrayInsert,
    arrayRemove,
    arraySum,
    sortActivitiesByStart,
    rangesOverlap,
    range,
    activitiesEqual,
    minutesToDurationString,
    roundToStep
};
