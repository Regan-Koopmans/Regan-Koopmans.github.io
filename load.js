// if (typeof InstantClick === 'undefined') {
//     const scriptPromise = new Promise((resolve, reject) => {
//         const script = document.createElement('script');
//         document.body.appendChild(script);
//         script.onload = resolve;
//         script.onerror = reject;
//         script.async = true;
//         script.src = '/instantclick.min.js';
//     });
//
//     scriptPromise.then(() => {
//         InstantClick.init()
//     });
// }