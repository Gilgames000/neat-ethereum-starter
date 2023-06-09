export function scrollPageTo(targetId: string): void {
  const elemPage: HTMLElement | null = document.querySelector('#page');
  const targetElem: HTMLElement | null = document.querySelector(targetId);
  const targetOffsetTop = targetElem?.offsetTop;

  if (elemPage && targetOffsetTop) {
    elemPage.scrollTo({ top: targetOffsetTop - 85, behavior: 'smooth' });
  }
}
