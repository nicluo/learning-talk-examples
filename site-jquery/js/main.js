if(window.location.search.indexOf('all') > 0){
  JSON_FILE = '/json/combined-all.json';
} else if(window.location.search.indexOf('100') > 0){
  JSON_FILE = '/json/combined-100.json';
} else {
  JSON_FILE = '/json/combined-30.json';
}

$(function(){
  const template = $('#issue-template').detach();

  $.getJSON(JSON_FILE, 
    function(json){
      json.forEach(function(issue){
        const newTemplate = $(template).clone();
        newTemplate.find('.issue-no').text(issue.number);
        newTemplate.find('.issue-title').text(issue.title);
        newTemplate.find('.issue-author').text(issue.user.login);
        newTemplate.find('.issue-timestamp').text(issue.created_at);
        newTemplate.find('.issue-body').html($('<pre></pre>').text(issue.body));
        newTemplate.attr('id', 'issue-' + issue.number);
        $('#issue-list').append(newTemplate);
      });
      bindEvents();
    })

  $('#search').keyup(function(){
    search();
  })
})

function bindEvents() {
  $('.issue-metadata-row').click(function(e){
    console.log(e);
    $(this).next().toggle();
  });
}

function search(){
  const t0 = performance.now();
  const search = $('#search').val();
  $('#issue-list tbody').each(function(){
    if($(this).find('td:contains('+search+')').length){
      $(this).show();
    } else {
      $(this).hide();
    }
  })
  const t1 = performance.now();
  console.log("search " + search + ' - ' + (t1 - t0) + " milliseconds.")
}
