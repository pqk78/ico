export default async function renderliquid(file, options, target) {
  try {
    let html = await liquid.render(file, options);
    const load = (file) => {
      target.innerHTML = html;
      target.classList.remove('loading');
      target.classList.add('loaded');
      window.global.callbacks[file] && window.global.callbacks[file]();
      window.global.callbacks.common();
    }
    if (target.classList.contains('loading')) {
      load(file);
    }
    else {
      target.classList.remove('loaded');
      target.classList.add('loading');
      setTimeout(load, 100, file);
    }
  } catch (err) {
    console.error(err)
  }
}