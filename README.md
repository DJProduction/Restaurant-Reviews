# Restaurant Reviews Site
---
## Project Overview

For the **Restaurant Reviews** project, A static webpage was converted into a responsive web application with additional robust features. The goal is to imporve the user experience to be comparible to a native application.

## Initial Site Problems

The static format of the site was not capable of changing to accomidate the various commonly sized displays. It barely displayed correctly on a desktop and became near impossible to navigate on mobile devices. Additionally, the site was not compatible with accessibility applications such as screen readers. Visitors are unable to access the site when their devices have poor or no internet connections.

## How to download and launch Restaurant Reviews Site
1. To run on your computer simply click the **Clone or Download** button on the top right.
2. You can **Download to Desktop** or **Download as Zip** and the file will be download to your local Downloads folder.
3. Unzip/Open the downloaded restaurant-reviews folder
4. In this folder, start up a simple HTTP server to serve up the site files on your local computer. Python has some simple tools to do this, and you don't even need to know Python. For most people, it's already installed on your computer.

    * In a terminal, check the version of Python you have: `python -V`. If you have Python 2.x, spin up the server with `python -m SimpleHTTPServer 8000` (or some other port, if port 8000 is already in use.) For Python 3.x, you can use `python3 -m http.server 8000`. If you don't have Python installed, navigate to Python's [website](https://www.python.org/) to download and install the software.
   * Note -  For Windows systems, Python 3.x is installed as `python` by default. To start a Python 3.x server, you can simply enter `python -m http.server 8000`.
5. With your server running, visit the site: `http://localhost:8000`

## Making A Responsive Site

We live in a mobile-first world. In order to ensure that the site followed this ideology, the first focus was making sure the site look acceptable on smartphones.

### Scaling
This meant adding things such as:
```
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```
This helps keep pixel-to-pixel scaling for any device the user visits the site on.

### Sizing Elements and Alignment
An easy way to dynamically size elements with little concern about different device sizes is to use a flexbox.
```
article, aside, canvas, details, figcaption, figure, footer, hgroup, menu, section, header, nav, main {
    display: flex;
    flex-wrap: wrap;
}
```
This container works well with percentages which is better for the many different and unusual device sizes the site will be displayed on.
```
#picture-cuisine-container{
  width: 100%;
  height: auto;
}
```
The majority of the content was centered with a few exceptions. Notice even the alignment was made easier by inheriting the capabilities from the parent flexbox.
```
#title-container {
  width: 100%;
  height: 70px;
  display: inherit;
  flex-wrap: inherit;
  background-color: #252831;
  text-align:center;
  justify-content: center;
}
```

### Pictures/Images
The picture tag was used to ensure proper sizing as well as assist with performance. Smartphones will properly hold the ratio of a larger image that is reduced in size. The reason perfomance was improved was because the resolution of images do not need to be sharp when displayed on a small smartphone screen. So a smaller resolution image will boost the overall loading speed of the page for smaller devices. Laptops and computers usually have access to faster wifi speeds which is acceptable to load larger resolutions.
```
<picture>
  <source media="(max-width: 768px)"  srcset="${DBHelper.imageSmallUrlForRestaurant(restaurant)}"> <source media="(min-width: 769px)"
  srcset="${DBHelper.imageUrlForRestaurant(restaurant)}"> <img class='restaurant-img'
  src="${DBHelper.imageUrlForRestaurant(restaurant)}" alt="${restaurant.name} Restuarant Picture">
</picture>
```

### Media Queries
Including media queries in the [responsive.css](https://github.com/DJProduction/Restaurant-Reviews/blob/master/css/responsive.css) file helped manage how the site would be displayed depending on the visitor's device. The browser will request the appropriate css styles based on the device screen size from the responsive.css file.
```
/******** Small devices (portrait tablets and large phones, 600px and up) ********/
@media only screen and (min-width: 600px) {
    Styling changes needed for this screen size
}
/********* Medium devices (landscape tablets, 768px and up) ********/
@media only screen and (min-width: 768px) {
    Styling changes needed for this screen size
}
/******** Extra large devices (large laptops and desktops, 1200px and up) ********/
@media only screen and (min-width: 1200px) {
    Styling changes needed for this screen size
}
```
You can visit on desktop or mobile and notice the different layouts depending on the device. An alternative for developers is right-clicking anywhere inside the site and selecting the Inspect button. This will launch the developer tools tools where you can see how the site will look for different devices.

## Accessibility
The screen reader used for the majority of accessibility testing was [ChromeVox](https://chrome.google.com/webstore/detail/chromevox/kgejglhpjiefppelpmljglcjbhoiplfn?hl=en).

### Semantic Tags and Tabindex
The main structure element tags were changed to show some order for the screen reader applications as the user navigates the site. For example tags such as headers `<h1>, <h2>, <h3> ...` were reorganized for important elements of the pages.

In order for the user to understand the structure of the site the tabindex property was used on elements that may have **not** been focused on by the screen reader.
```
<table id="restaurant-hours" tabindex="0"
```

### Handling Images
To ensure that the user has an idea of significant images the `alt` image property was added to the image templates. This is to help describe the image to the visitor no matter what their condition may be.
```
<img class='restaurant-img' src="${DBHelper.imageUrlForRestaurant(restaurant)}" alt="${name.innerHTML} Restuarant Picture" tabindex="0" role="img">
```

### LeafMap Accessibility
Users of screen readers should still be able to use the map if they want to learn about different restaurants. The screen reader should still be able to tell the user which restuarant is markered on the map depending on their filter options. Once the desired restaurant is selected, the user should be able to navigate straight to the restaurant details page for that restaurant.
In order to accomplish these things an `alt` and `keyboard` properties were found in the LeafMap documentation and added to the [dbhelper.js](https://github.com/DJProduction/Restaurant-Reviews/blob/master/js/dbhelper.js).
```
  static mapMarkerForRestaurant(restaurant, map) {
      ...
      {
        title: restaurant.name,
        alt: `${restaurant.name} marked on map`,
        url: DBHelper.urlForRestaurant(restaurant),
        keyboard: true
      })
      ....
```

### Aria Standards
To ensure all users who used screen readers were able to understand each focusable element on the site. Common aria properties were inserted into the elements. Semantic tags were properly used in each section so that additional aria properties were not needed to explain the content to the user.

For example:
```
role="combobox" name="neighborhoods" onchange="updateRestaurants()">
<option value="all">All Neighborhoods</option>
```
Based on standard HTML5 rules the screen reader can properly explain this is a "combobox named neighborhoods" to a user. Then the applicationwould read each option to the user.

Otherwise, important elements were explained with aria properties. For example this is a literal template for the reviewers' posts.
```
`
  <strong tabindex="0" role="text" aria-label="Reviewer's name: ${review.name}">${review.name}</strong>
  <p tabindex="0" role="text" aria-label="Date of review: ${review.date}">${review.date}</p>
  <p id="review-rating" tabindex="0" role="text">Rating: ${review.rating}</p>
  <p tabindex="0" role="text" aria-label="Reviewer's comment: ${review.comments}">${review.comments}</p>
`
  ```
Each focusable element has a role, name/label, and value for the screen reader to repeat so the user can understand the content with some additional context.

## Service Worker

Service workers can be used for a multitude of situations such as offline content, background-sync, browser notifications, and more. The focus of this site was on capturing offline content for a visitor who may lose an internet connection.

### Registration
The base code for registering a service worker can be found on the [Google Developers site](https://developers.google.com/web/fundamentals/primers/service-workers/). The important issue was discovering that the scope of the service worker was extremely important. The scope of the service worker is limited to the current registered directory destination and other "child" folders. To ensure the service worker could respond to actions on the entire site the [service_worker.js](https://github.com/DJProduction/Restaurant-Reviews/blob/master/sw/service_worker.js) file was moved to the site's root directory.

### Service Worker Steps
Service Workers have a few basic states in their lifecycle. The important ones for this site will be listed below.

1. Cache name is used to reference versions of the service worker.
```
const CACHE_NAME = 'restuarant-cache-v1';
```
2. An array of urls may be needed to reference files held by the service worker for offline use.
```
let urlsToCache = [];
```
3. Listening for the "install" event which is fired by the service worker to handle the initial structure of the service worker. For example the array of urls can be inserted into an 'open' cache by reference to the name.
4. Listening for the "activate" event which is fired by the service worker for possibly clearing old caches and replacing with new caches that may be waiting to be updated.

### Caching Files On Visited Pages
When an site fetches the information from a url, the service worker can listen and intercept the function to carry out various useful actions. For this site the listener will perform the following:
1.  Check to make sure that the url fetched is not already in the cache. If so, then returns cached file contents without adding to cache.
2. Fetches from the network and returns the response from the fetched url.
3. If step **2** occurs, uses clone function to add the file to the cache for future use by the user if the connection is lost.

## Contributions: Leaflet.js and Mapbox

This repository uses [leafletjs](https://leafletjs.com/) with [Mapbox](https://www.mapbox.com/). You need to replace `<your MAPBOX API KEY HERE>` with a token from [Mapbox](https://www.mapbox.com/). Mapbox is free to use, and does not require any payment information.

### Note about ES6

Most of the code in this project has been written to the ES6 JavaScript specification for compatibility with modern web browsers and future-proofing JavaScript code. As much as possible, try to maintain use of ES6 in any additional JavaScript you write.
