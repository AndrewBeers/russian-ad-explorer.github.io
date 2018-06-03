---
---

// Static Variables

var ad_values = ['ad_id', 'ad_copy','ad_landing_page', 'ad_targeting_location', 'age', 'language', 'placements', 'ad_impressions', 'ad_clicks', 'ad_spend_usd', 'ad_spend_rub', 'ad_creation_date', 'ad_end_date', 'interest_expansion', 'date_order_index'];
var sort_values = ['ad_creation_date', 'ad_clicks', 'ad_impressions', 'ad_spend_usd', 'efficiency_clicks', 'efficiency_impressions'];
var chosen_sort = 'ad_clicks';
var ad_values_length = ad_values.length;


// Static Functions

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
  results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function buildSortOptions(name){

  if(name == 'ad_clicks'){
    return {'ad_clicks': 'desc'}  
  }

  if(name == 'ad_spend_usd'){
    return {'ad_spend_usd': 'desc'}  
  }

  if(name == 'ad_impressions'){
    return {'ad_impressions': 'desc'}  
  }

  if(name == 'ad_creation_date'){
    return {'date_order_index': 'asc'}  
  }

  if(name == 'efficiency_impressions'){
    return {'efficiency_impressions': 'desc'}  
  }

  if(name == 'efficiency_clicks'){
    return {'efficiency_clicks': 'desc'}  
  }

  if(name == 'conversion_rate'){
    return {'conversion_rate': 'desc'}  
  }
}

function PreloadImage(imgSrc, img_id, callback){
  var objImagePreloader = new Image();

  objImagePreloader.src = imgSrc;
  if(objImagePreloader.complete){
    if (img_id == $("#primary-details").children().children('#ad_id').text()) {
      callback(imgSrc);
    }
    objImagePreloader.onload=function(){};
  }
  else{
    objImagePreloader.onload = function() {
      if (img_id == $("#primary-details").children().children('#ad_id').text()) {
        callback(imgSrc);
      }
      //    clear onLoad, IE behaves irratically with animated gifs otherwise
      objImagePreloader.onload=function(){};
    }
  }
}

function changePrimaryImage(imgSrc){
  $("#primary-image").children('img').attr('style', 'width: 100%');
  $("#primary-image").children('img').attr('src', imgSrc);
}

function grabNeedle(key, value){
  needle = russian_ads.filter(
    function(data){ return data[key] === value }
    );
  return needle
}

function getContentByIndex(page_id, key){

  var needle = grabNeedle(key, page_id)

  for(i = 0; i < ad_values_length; i++) {
    data_point = needle[0][ad_values[i]]
    if (data_point === null) {
      data_point = '[Unavailable]'
    }
    $("#primary-details").children().children('#' + ad_values[i]).text(data_point);
  }

  changePrimaryImage('{{ site.baseurl }}/resources/projects/2018-05-09-russian-ads/loading_spinner.gif')
  $("#primary-image").children('img').attr('style', 'width: inherit')
  image_id = $("#primary-details").children().children('#ad_id').text();
  image_source = 'https://github.com/AndrewBeers/anderff-site/raw/master/resources/projects/2018-05-09-russian-ads/data/' + needle[0].image_filepath
  PreloadImage(image_source, image_id, changePrimaryImage)

  $("#download").children().attr("href", ('https://github.com/AndrewBeers/anderff-site/raw/master/resources/projects/2018-05-09-russian-ads/data/' + needle[0].pdf_filepath));

  $("#twitter-button").attr('href', 'https://twitter.com/intent/tweet?text=' + encodeURI('"' + needle[0]['ad_copy'].substring(0, 100) + '..." An ad bought by the Russian Internet Research Assocation on Facebook and Instagram.') + '&url=' + encodeURI(window.location.href));

  $("#facebook-button").attr('href', 'http://www.facebook.com/sharer/sharer.php?u=' + encodeURI(window.location.href) + '&title=' + encodeURI('The Russian Ad Explorer'));

  $('meta[property="og:image"]').remove();
  $('meta[property="og:description"]').remove();
  $('meta[property="og:url"]').remove();
  $("head").append('<meta property="og:image" content="' + 'https://github.com/AndrewBeers/anderff-site/raw/master/resources/projects/2018-05-09-russian-ads/data/' + needle[0].image_filepath + '">');
  $("head").append('<meta property="og:description" content="' + needle[0]['ad_copy'].substring(0, 100) + '...">');
  $("head").append('<meta property="og:url" content="' + window.location.href + '">');

  history.replaceState('', 'Russian Ad Explorer', '?ad_id=' + needle[0]['date_order_index'])

  var next_needle = grabNeedle(key, page_id + 1)
  var previous_needle = grabNeedle(key, page_id - 1)

  $('#next-text').text(next_needle[0].month[0] + '/' + next_needle[0].day + '/' + next_needle[0].year[0])
  $('#previous-text').text(previous_needle[0].month[0] + '/' + previous_needle[0].day + '/' + previous_needle[0].year[0])

}

function initSliders(){
  $("#click_slider").slider({
    min: 0,
    max: 100000,
    values:[0, 100000],
    step: 1,
    range:true,
    slide: function( event, ui ) {
      $("#click_range_label" ).html(ui.values[ 0 ] + ' - ' + ui.values[ 1 ] + ' clicks');
      $('#click_filter').val(ui.values[0] + '-' + ui.values[1]).trigger('change');
    }
  });

  $("#impressions_slider").slider({
    min: 0,
    max: 1000000,
    values:[0, 1000000],
    step: 1,
    range: true,
    slide: function( event, ui ) {
      $("#impressions_range_label" ).html(ui.values[ 0 ] + ' - ' + ui.values[ 1 ] + ' impressions');
      $('#impressions_filter').val(ui.values[0] + '-' + ui.values[1]).trigger('change');
    }
  });

  $("#spend_slider").slider({
    min: 0,
    max: 50000,
    values:[0, 50000],
    step: 1,
    range: true,
    slide: function( event, ui ) {
      $("#spend_range_label" ).html(ui.values[ 0 ] + ' - ' + ui.values[ 1 ] + ' RUB');
      $('#spend_filter').val(ui.values[0] + '-' + ui.values[1]).trigger('change');
    }
  });

}