---
---

// Static Variables

var ad_values = ['ad_id', 'ad_copy','ad_landing_page', 'ad_targeting_location', 'age', 'language', 'placements', 'ad_impressions',  'ad_clicks', 'ad_spend_usd', 'ad_spend_rub', 'ad_creation_date', 'ad_end_date', 'interest_expansion', 'date_order_index', 'efficiency_impressions', 'efficiency_clicks', 'conversion_rate'];

var sort_values = ['ad_creation_date', 'ad_clicks', 'ad_impressions', 'ad_spend_usd', 'efficiency_clicks', 'efficiency_impressions'];
var number_values = ['ad_impressions', 'ad_clicks', 'efficiency_impressions', 'efficiency_clicks', 'conversion_rate'];

var chosen_sort = 'ad_clicks';
var ad_values_length = ad_values.length;

var number_formatter = new Intl.NumberFormat('en-US', {
  // the default value for minimumFractionDigits depends on the currency
  // and is usually already 2
});

var rub_formatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2
  // the default value for minimumFractionDigits depends on the currency
  // and is usually already 2
});

var usd_formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  // the default value for minimumFractionDigits depends on the currency
  // and is usually already 2
});

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
    if(number_values.includes(ad_values[i])){

    $("#primary-details").children().children('#' + ad_values[i]).text(number_formatter.format(data_point));
}
    else if(ad_values[i] == 'ad_spend_usd') {
    $("#primary-details").children().children('#' + ad_values[i]).text(usd_formatter.format(data_point));
    }
    else if(ad_values[i] == 'ad_spend_rub'){
    $("#primary-details").children().children('#' + ad_values[i]).text(rub_formatter.format(data_point)); 
    }
    else {
    $("#primary-details").children().children('#' + ad_values[i]).text(data_point);
  }
  }

  // for(i = 0; i < number_values.length; i++) {
  //   number_text = $("#primary-details").children().children('#' + number_values[i]).text();
  //   $("#primary-details").children().children('#' + number_values[i]).text(usd_formatter.format(number_text));
  // }

  changePrimaryImage('{{ site.baseurl }}/loading_spinner.gif')
  $("#primary-image").children('img').attr('style', 'width: inherit')
  image_id = $("#primary-details").children().children('#ad_id').text();
  image_source = 'https://github.com/russian-ad-explorer/russian-ad-datasets/raw/master/images/' + needle[0].image_filepath
  PreloadImage(image_source, image_id, changePrimaryImage)

  $("#download").children().attr("href", ('https://github.com/russian-ad-explorer/russian-ad-pdfs/raw/master/pdfs/' + needle[0].pdf_filepath));

  // console.log('https://twitter.com/intent/tweet?text=' + encodeURI('"' + needle[0]['ad_copy'].substring(0, 100) + '..." An ad bought by the Russian Internet Research Assocation on Facebook and Instagram.') + '&url=' + encodeURI(window.location.href))

  $("#twitter-button").attr('href', 'https://twitter.com/intent/tweet?text=' + encodeURI('"' + needle[0]['ad_copy'].substring(0, 100) + '..." An ad bought by the Russian Internet Research Assocation on Facebook and Instagram.') + '&url=' + encodeURI(window.location.href));

  $("#facebook-button").attr('href', 'http://www.facebook.com/sharer/sharer.php?u=' + encodeURI(window.location.href) + '&title=' + encodeURI('The Russian Ad Explorer'));

  $('meta[property="og:image"]').remove();
  $('meta[property="og:description"]').remove();
  $('meta[property="og:url"]').remove();
  $("head").append('<meta property="og:image" content="' + 'https://github.com/russian-ad-explorer/russian-ad-datasets/raw/master/images/' + needle[0].image_filepath + '">');
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