(function () {
  function toDateString(dateObj) {
    return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
  }

  function renderSharedCalendar(container, options = {}) {
    if (!container) return;

    const baseDate = options.baseDate instanceof Date ? options.baseDate : new Date();
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const firstWeekday = (firstDay.getDay() + 6) % 7; // Monday=0
    const totalCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;

    const locale = options.locale || 'ro-RO';
    const selectedDate = options.selectedDate || '';
    const showWeekdayHeader = options.showWeekdayHeader !== false;
    const onSelectDate = typeof options.onSelectDate === 'function' ? options.onSelectDate : null;
    const isDateDisabled = typeof options.isDateDisabled === 'function' ? options.isDateDisabled : (() => false);
    const isDateMarked = typeof options.isDateMarked === 'function' ? options.isDateMarked : (() => false);
    const isDateHighlighted = typeof options.isDateHighlighted === 'function' ? options.isDateHighlighted : (() => false);

    const todayStr = toDateString(new Date());

    container.innerHTML = '';

    if (showWeekdayHeader) {
      const labels = [
        typeof translate === 'function' ? translate('calendarWeekdayMon') : 'Mon',
        typeof translate === 'function' ? translate('calendarWeekdayTue') : 'Tue',
        typeof translate === 'function' ? translate('calendarWeekdayWed') : 'Wed',
        typeof translate === 'function' ? translate('calendarWeekdayThu') : 'Thu',
        typeof translate === 'function' ? translate('calendarWeekdayFri') : 'Fri',
        typeof translate === 'function' ? translate('calendarWeekdaySat') : 'Sat',
        typeof translate === 'function' ? translate('calendarWeekdaySun') : 'Sun'
      ];

      labels.forEach(label => {
        const header = document.createElement('div');
        header.className = 'calendar-weekday';
        header.innerText = label;
        container.appendChild(header);
      });
    }

    for (let i = 0; i < totalCells; i++) {
      const dayNumber = i - firstWeekday + 1;
      const cell = document.createElement('div');
      cell.className = 'day';

      if (dayNumber < 1 || dayNumber > daysInMonth) {
        cell.classList.add('empty');
        cell.setAttribute('aria-hidden', 'true');
        container.appendChild(cell);
        continue;
      }

      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
      const disabled = Boolean(isDateDisabled(dateStr));

      if (disabled) {
        cell.classList.add('past');
        cell.setAttribute('aria-disabled', 'true');
      }

      if (dateStr === todayStr) {
        cell.classList.add('today');
      }

      if (isDateHighlighted(dateStr)) {
        cell.classList.add('active');
      }

      if (selectedDate && dateStr === selectedDate) {
        cell.classList.add('active');
      }

      cell.innerText = dayNumber;

      if (isDateMarked(dateStr)) {
        cell.classList.add('has-plans');
        const dot = document.createElement('span');
        dot.className = 'plan-indicator';
        cell.appendChild(dot);
      }

      if (!disabled && onSelectDate) {
        cell.onclick = () => onSelectDate(dateStr, cell, { year, month, day: dayNumber, locale });
      }

      container.appendChild(cell);
    }
  }

  window.renderSharedCalendar = renderSharedCalendar;
})();
