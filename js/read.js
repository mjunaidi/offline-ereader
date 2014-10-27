(function() {
  "use strict";

  var template = document.querySelector('#page-template');
  template.fontFamily = 'Georgia';
  template.fontSizePercent = '100';
  template.theme = 'Light';
  template.showToolbars = false;

  var urlParams = new Map(window.location.search.substring(1).split('&').map(function(keyValuePair) {
    return keyValuePair.split('=').map(decodeURIComponent);
  }));
  template.bookUrl = urlParams.get('bookUrl');
  template.title = urlParams.get('title');

  template.addEventListener('template-bound', function() {
    var pageableText = document.querySelector('#text');
    var chaptersMenu = document.querySelector('#chapters-menu');
    template.jumpToChapter = function(e) {
      pageableText.scrollToElement(e.target.templateInstance.model.chapterElement);
      chaptersMenu.toggle();
      template.toggleToolbars();
    };

    var toolbarAnimation = document.querySelector('#toolbar-animation');
    toolbarAnimation.target = [].slice.call(document.querySelectorAll('core-toolbar'));
    template.toggleToolbars = function() {
      toolbarAnimation.direction = template.showToolbars ? 'forward' : 'reverse';
      template.showToolbars = true;
      toolbarAnimation.play();
    };
    template.finishToolbarAnimation = function() {
      template.showToolbars = toolbarAnimation.direction === 'reverse';
    };

    var EDGE_FRACTION = 0.15;
    template.handleClick = function(e) {
      if (pageableText.clientWidth > 0) {
        var percentOfWidth = e.clientX / pageableText.clientWidth;
        if (percentOfWidth <= EDGE_FRACTION) {
          pageableText.previousPage();
        } else if (percentOfWidth >= (1 - EDGE_FRACTION)){
          pageableText.nextPage();
        } else {
          template.toggleToolbars();
        }
      }
    };

    template.handleKeyPress = function(e) {
      switch (e.detail.key) {
        case 'left':
          pageableText.previousPage();
        break;

        case 'right':
        case 'space':
          pageableText.nextPage();
        break;

        case 'esc':
          template.toggleToolbars();
        break;
      }
    };

    var formatDialog = document.querySelector('#format-dialog');
    template.toggleFormatDialog = function() {
      formatDialog.toggle();
    };
  });
})();
