const dateRegexp = /^\d{2}-\d{2}-\d{4}$/;
const locationRegexp = /^[A-Z][a-z]+$/;
const stringRegexp = /^[\p{L}'-]+$/u;
const phoneRegexp = /^(\+38)?0\d{9}$/;
const workScheduleRegexp = /^([01]\d|2[0-3]):[0-5]\d$/;

module.exports = {
  dateRegexp,
  locationRegexp,
  stringRegexp,
  phoneRegexp,
  workScheduleRegexp,
};
