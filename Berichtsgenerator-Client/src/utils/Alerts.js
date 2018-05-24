export default function altert(add, remove) {
  add();
  window.setTimeout(remove, 5000);
}
