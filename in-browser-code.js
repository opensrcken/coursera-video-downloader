/**
 * downloads from React-based coursera pages.
 *
 * rename SECTION between weeks
 */
var SECTION = 'ML specialization - UW/Regression/wk6 - Nearest Neighbors & Kernel Regression';

var lessonNumber = $('.lesson-number').text().slice(0, -1);
var section = SECTION + '/' + lessonNumber + ' - ' + $('.lesson-name').text();
var currentVideoName = $('.c-video-title').text();
var url = $('.resource-link[download="lecture.vtt"]').attr('href');
var currentVideoIdx = (function () {
  var videoNames = $('.lesson-items .rc-ItemLink').toArray().filter(function (el) {
    // only consider subsections that contain a video
    return $(el).find('.cif-play, .cif-item-video').length;
  }).map(function (el) {
    return $(el).find('.item-name').text();
  });
  var idx = videoNames.indexOf(currentVideoName);
  if (idx === -1) {
    console.log('videoNames', videoNames);
    throw new Error("Video name not found in list!");
  }

  // return human-readable idx
  return idx + 1;
})();
var filename = currentVideoIdx + ' - ' + currentVideoName + '.mp4';

function goToNext() {
  var subsectionLinks = $('.lesson-items .rc-ItemLink');
}

$.post('https://localhost:3000', {
  section: section,
  filename: filename,
  url: url
}).then(function () {
  console.log('DOWNLOADED');
}, function (err) {
  console.error('ERROR', err);
});
