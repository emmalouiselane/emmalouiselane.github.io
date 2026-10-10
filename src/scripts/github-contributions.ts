const contributionGrid = document.querySelector<HTMLElement>('.contribution-grid');
const cells = document.querySelectorAll<HTMLElement>('.contribution-cell[data-tooltip]');

const scrollToLatestContributions = () => {
  if (contributionGrid && contributionGrid.scrollWidth > contributionGrid.clientWidth) {
    contributionGrid.scrollLeft = contributionGrid.scrollWidth;
  }
};

const tooltip = document.createElement('div');
tooltip.className = 'contribution-tooltip';
tooltip.setAttribute('role', 'tooltip');
tooltip.hidden = true;
tooltip.id = 'contribution-tooltip';
document.body.appendChild(tooltip);

let activeCell: HTMLElement | null = null;
let isHovered = false;
let isFocused = false;

const positionTooltip = () => {
  if (!activeCell) 
    return;


  const cellRect = activeCell.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();
  const halfWidth = tooltipRect.width / 2;
  const horizontalPadding = 8;
  const left = Math.min(
    Math.max(cellRect.left + cellRect.width / 2, halfWidth + horizontalPadding),
    window.innerWidth - halfWidth - horizontalPadding,
  );
  const fitsAbove = cellRect.top - tooltipRect.height - 8 >= horizontalPadding;
  
  tooltip.style.setProperty('--contribution-tooltip-left', `${left}px`);
  tooltip.style.setProperty('--contribution-tooltip-top', `${fitsAbove ? cellRect.top - 8 : cellRect.bottom + 8}px`);
  tooltip.classList.toggle('is-below', !fitsAbove);
};

const hideTooltip = () => {
  activeCell = null;
  tooltip.hidden = true;
};

const showTooltip = (cell: HTMLElement) => {
  activeCell = cell;
  tooltip.textContent = cell.dataset.tooltip || '';
  tooltip.hidden = false;
  cell.setAttribute('aria-describedby', tooltip.id);
  positionTooltip();
};

cells.forEach((cell) => {
  cell.addEventListener('pointerenter', () => {
    isHovered = true;
    showTooltip(cell);
  });
  cell.addEventListener('pointerleave', () => {
    isHovered = false;
    if (!isFocused) hideTooltip();
  });
  cell.addEventListener('focus', () => {
    isFocused = true;
    showTooltip(cell);
  });
  cell.addEventListener('blur', () => {
    isFocused = false;
    if (!isHovered) hideTooltip();
  });
});

window.addEventListener('resize', positionTooltip);
window.addEventListener('resize', scrollToLatestContributions);
requestAnimationFrame(scrollToLatestContributions);
window.addEventListener('scroll', positionTooltip, true);

export {};
