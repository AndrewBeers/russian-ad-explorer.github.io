# The Russian Ad Explorer

<img src="https://media.githubusercontent.com/media/russian-ad-explorer/russian-ad-datasets/master/images/2016-01/P10003209.-000.png">

On May 10, 2018, Democrats on the United States House Intelligence Committee released 3,500+ ads created by the Internet Research Agency between 2015 and 2017. The Internet Research Agency is believed to have created these ads to influence the outcome of the 2016 United States presidential election, and in general influence Americans' political views.

This Github repository contains code for a visualization tool to view these ads, which can be viewed at this link: <a href="https://russian-ad-explorer.github.io">https://russian-ad-explorer.github.io</a>. Extensive documentation on design and presentation choices for this visualization tool can be found on the <a href="https://russian-ad-explorer.github.io/about">About</a> page of the explorer. The data that powers this tool is hosted on these Github repositories: <a href="https://github.com/russian-ad-explorer/russian-ad-datasets">russian-ad-datasets</a> and <a href="https://github.com/russian-ad-explorer/russian-ad-pdfs">russian-ads-pdfs</a>.

You can read about a few more technical notes below.

## Implementation Notes
- [Data Hosting with Github LFS](#data)
- [Sorting and Filtering with filter.js](#filter.js) 
- [Contact](#contact)

## Data

PDFs, extracted images (cropped, and resized to smaller resolutions), extracted text, and 

## Filter.js

This explorer is built on the filter.js library (<a href="https://github.com/jiren/filter.js">link</a>). I have a modified version of filter.js in this explorer that has a few additional lines in the "pagination" section to add features to the thumbnails.

## Contact

If you have any requests, or questions regarding this dataset and explorer, send a message to russian.ad.explorer@gmail.com. I would love to hear any feedback you may have — this is an entirely informal effort, and I'll try to incorporate any suggestions as I have time.