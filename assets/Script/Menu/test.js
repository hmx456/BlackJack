var dirty = false;

module.exports = {
    setDirty: function () {
        dirty = true;
    },
    isDirty: function () {
        return dirty;
    },
};