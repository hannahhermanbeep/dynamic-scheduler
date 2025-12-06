/**
 * state.js
 * Global state management for the dynamic classroom scheduler
 */

window.state = (function() {
    // Current schedule for the day (array of activity objects)
    let currentSchedule = [];

    // Original default schedule (loaded at page load or template load)
    let defaultSchedule = [];

    // Templates: name -> array of activity objects
    let templates = {};

    // Undo/redo stacks
    const undoStack = [];
    const redoStack = [];

    // Day-specific overrides: date string ("YYYY-MM-DD") -> template name
    const dayOverrides = {};

    // Current date in minutes (for real-time locks)
    let currentTimeMinutes = null;

    // Public functions
    return {

        // Set default schedule
        setDefaultSchedule: function(schedule) {
            defaultSchedule = utils.deepCopy(schedule);
            currentSchedule = utils.deepCopy(schedule);
        },

        // Get current schedule
        getCurrentSchedule: function() {
            return utils.deepCopy(currentSchedule);
        },

        // Replace current schedule
        setCurrentSchedule: function(schedule) {
            // Push previous state to undo stack
            undoStack.push(utils.deepCopy(currentSchedule));
            // Clear redo stack
            redoStack.length = 0;
            currentSchedule = utils.deepCopy(schedule);
        },

        // Undo last change
        undo: function() {
            if (undoStack.length === 0) return;
            redoStack.push(utils.deepCopy(currentSchedule));
            currentSchedule = undoStack.pop();
        },

        // Redo last undone change
        redo: function() {
            if (redoStack.length === 0) return;
            undoStack.push(utils.deepCopy(currentSchedule));
            currentSchedule = redoStack.pop();
        },

        // Reset to default schedule
        resetToDefault: function() {
            undoStack.push(utils.deepCopy(currentSchedule));
            redoStack.length = 0;
            currentSchedule = utils.deepCopy(defaultSchedule);
        },

        // Save a schedule template
        saveTemplate: function(name, schedule) {
            templates[name] = utils.deepCopy(schedule);
        },

        // Load a schedule template
        loadTemplate: function(name) {
            if (!(name in templates)) return false;
            undoStack.push(utils.deepCopy(currentSchedule));
            redoStack.length = 0;
            currentSchedule = utils.deepCopy(templates[name]);
            return true;
        },

        // Get all template names
        getTemplateNames: function() {
            return Object.keys(templates);
        },

        // Set day override for a specific date
        setDayOverride: function(dateStr, templateName) {
            dayOverrides[dateStr] = templateName;
        },

        // Get template for a specific date
        getTemplateForDate: function(dateStr) {
            return dayOverrides[dateStr] || null;
        },

        // Set the current time in minutes (used for real-time locks)
        setCurrentTimeMinutes: function(minutes) {
            currentTimeMinutes = minutes;
        },

        // Get the current time in minutes
        getCurrentTimeMinutes: function() {
            return currentTimeMinutes;
        },

        // Get default schedule (deep copy)
        getDefaultSchedule: function() {
            return utils.deepCopy(defaultSchedule);
        },

        // Get templates (deep copy)
        getTemplates: function() {
            return utils.deepCopy(templates);
        },

        // Export templates as JSON string
        exportTemplates: function() {
            return JSON.stringify(templates, null, 2);
        },

        // Import templates from JSON string
        importTemplates: function(jsonStr) {
            try {
                const obj = JSON.parse(jsonStr);
                if (typeof obj === 'object' && obj !== null) {
                    for (let key in obj) {
                        templates[key] = obj[key];
                    }
                    return true;
                }
            } catch(e) {
                console.error("Invalid template JSON", e);
            }
            return false;
        }

    };
})();
