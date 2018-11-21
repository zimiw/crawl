const superagent = require('superagent');
const cheerio = require('cheerio');
const async = require('async');
const fs = require('fs');
const url = require('url');
const request = require('request');
const baseUrl = 'https://yyk.99.com.cn';

//省份列表
let proviceUrl = [];
let hosUrl = [];
let hospitals = [];
let total = 0;
var store = {};
var count = 0

var hosCount = 0;
var hosTotal = 0;

function removeSlash(str) {
    var result = Array.from(str);
    result.shift();
    result.pop();
    return result.join('');
}

function isStringEmpty(str) {
    return str === null || str === undefined || str === '';
}

concurrencyCount = 0

function fetchData(url, callback) {
    console.time('  耗时');
    concurrencyCount++;
    superagent.get(url).end(function(err, res) {
        console.log('并发数:', concurrencyCount--, 'fetch', url);
        //var $ = cheerio.load(res.text);
        if (err) {
            return console.error(err);
        }
        callback(null, [url, res.text]);
    });
}


superagent.get(baseUrl).end(function(err, res) {
    if (err) {
        return console.error(err);
    }
    let $ = cheerio.load(res.text);
    $('.area-list ul').each(function(idx, ele) {
        //console.log(ele)
        let $ele = $(ele);
        $ele.find('li a').each(function(idx, ele) {
            //console.log($(ele).attr('href'))
            if ($(ele).attr('href')) {
                //console.log($(ele).attr('href'))
                proviceUrl.push($(ele).attr('href'))
            }
        })
    });
    total = proviceUrl.length;
    console.log('get provice ' + proviceUrl)
    fs.writeFile("./proviceUrl.js", JSON.stringify(proviceUrl), err => {
                        if (!err) console.log("success~");
                    });

    // for (let i = 0; i < proviceUrl.length; i++) {
    //     if (proviceUrl[i] == '/suchuan/') {
    //         proviceUrl[i] = '/sichuan/';
    //     }
    //     superagent.get(baseUrl + proviceUrl[i]).end(function(err, res) {
    //         if (err) {
    //             return console.error(err);
    //         }
    //         count++
    //         let $ = cheerio.load(res.text);
    //         $('.m-box').each(function(idx, ele) {
    //             let name = $(ele).find('.u-title-3 span').text();
    //             if (!isStringEmpty(name)) {
    //                 $(ele).find('.m-table-2 a').each(function(idx, ele) {
    //                     hosUrl.push($(ele).attr('href'))
    //                 })
    //             }
    //         })
    //         if (total == count) {
    //             console.log(hosUrl.length)


    //             async.mapLimit(hosUrl, 300, function(topicUrl, callback) {
    //                 fetchData(baseUrl + topicUrl, callback);
    //                 console.timeEnd("  耗时");
    //             }, function(err, result) {
    //                 result = result.map(function(pair) {
    //                     var $ = cheerio.load(pair[1]);
    //                     var par = $('.wrap-name');
    //                     var info = $('.wrap-info dd');
    //                     return ({
    //                         'name': $(par).find('h1').text(),
    //                         'grade': $(par).find('.grade').text(),
    //                         'medical': $(par).find('.medical').text(),
    //                         'state': $(par).find('.state').text(),
    //                         'alias': $($(info).children('p').get(0)).text(),
    //                         'type': $($(info).children('p').get(1)).text(),
    //                         'tel': $($(info).children('p').get(2)).find('em').text(),
    //                         'address': $($(info).children('p').get(3)).find('em').text()
    //                     });
    //                 });
    //                 fs.writeFile("./hospitals.js", JSON.stringify(result), err => {
    //                     if (!err) console.log("success~");
    //                 });
    //             });
    //         }

    //     })

    // }


})