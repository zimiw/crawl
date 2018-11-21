const superagent = require('superagent');
const cheerio = require('cheerio');
const async = require('async');
const fs = require('fs');
const url = require('url');
const request = require('request');
const baseUrl = 'https://yyk.99.com.cn';

//省份列表
let proviceUrl = [];
//let hosUrl = [];
let hospitals = [];


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


// superagent.get(baseUrl).end(function(err, res) {
//     if (err) {
//         return console.error(err);
//     }
//     let $ = cheerio.load(res.text);
//     $('.area-list ul').each(function(idx, ele) {
//         let $ele = $(ele);
//         $ele.find('li a').each(function(idx, ele) {
//             if ($(ele).attr('href')) {
//                 proviceUrl.push($(ele).attr('href'))
//             }
//         })
//     });
//     for (let pro of proviceUrl) {
//         if (pro == '/suchuan/') {
//             pro = '/sichuan/';
//         }
//     }
//     proviceUrl = proviceUrl.map(function(item,idx){
//         if(item =='/suchuan/' ){
//             return '/sichuan/'
//         }
//         return item
//     });

// });


let hosUrl = [];
let path = '/anhui/'


superagent.get(baseUrl + path).end(function(err, res) {
        if (err) {
            return console.error(err);
        }
        let $ = cheerio.load(res.text);
        $('.m-box').each(function(idx, ele) {
            let name = $(ele).find('.u-title-3 span').text();
            if (!isStringEmpty(name)) {
                $(ele).find('.m-table-2 a').each(function(idx, ele) {
                    hosUrl.push($(ele).attr('href'))
                })
            }
        })
        console.log(hosUrl.length)


        async.mapLimit(hosUrl, 30, function(topicUrl, callback) {
            fetchData(baseUrl + topicUrl, callback);
            console.timeEnd("  耗时");
        }, function(err, result) {
            result = result.map(function(pair) {
                var $ = cheerio.load(pair[1]);
                var par = $('.wrap-name');
                var info = $('.wrap-info dd');
                var urlArr = pair[1].split('/');
                urlArr.pop();
                return ({
                    'code':urlArr.pop(),
                    'name': $(par).find('h1').text(),
                    'grade': $(par).find('.grade').text(),
                    'medical': $(par).find('.medical').text(),
                    'state': $(par).find('.state').text(),
                    'alias': $($(info).children('p').get(0)).text(),
                    'type': $($(info).children('p').get(1)).text(),
                    'tel': $($(info).children('p').get(2)).find('em').text(),
                    'address': $($(info).children('p').get(3)).find('em').text()
                });
            });
            fs.writeFile("./hospitals_"+ removeSlash(path) +".js", JSON.stringify(result), err => {
                if (!err) console.log("success~");
            });
        });

    })




function getByProvice(url, hosUrl, baseUrl) {

    superagent.get(baseUrl + url).end(function(err, res) {
        if (err) {
            return console.error(err);
        }
        let $ = cheerio.load(res.text);
        $('.m-box').each(function(idx, ele) {
            let name = $(ele).find('.u-title-3 span').text();
            if (!isStringEmpty(name)) {
                $(ele).find('.m-table-2 a').each(function(idx, ele) {
                    hosUrl.push($(ele).attr('href'))
                })
            }
        })
        console.log(hosUrl.length)


        async.mapLimit(hosUrl, 300, function(topicUrl, callback) {
            fetchData(baseUrl + topicUrl, callback);
            console.timeEnd("  耗时");
        }, function(err, result) {
            result = result.map(function(pair) {
                var $ = cheerio.load(pair[1]);
                var par = $('.wrap-name');
                var info = $('.wrap-info dd');
                return ({
                    'name': $(par).find('h1').text(),
                    'grade': $(par).find('.grade').text(),
                    'medical': $(par).find('.medical').text(),
                    'state': $(par).find('.state').text(),
                    'alias': $($(info).children('p').get(0)).text(),
                    'type': $($(info).children('p').get(1)).text(),
                    'tel': $($(info).children('p').get(2)).find('em').text(),
                    'address': $($(info).children('p').get(3)).find('em').text()
                });
            });
            fs.writeFile("./hospitals" + removeSlash(url) + ".js", JSON.stringify(result), err => {
                if (!err) console.log("success~");
            });
        });

    })

}