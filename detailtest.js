const superagent = require('superagent');
const cheerio = require('cheerio');
//const async = require('async');
const fs = require('fs');
const url = require('url');
const request = require('request');
const baseUrl = 'https://yyk.99.com.cn/';

var hospitals=[];

superagent.get(baseUrl + '/jieyang/114641/').end(function(err, res) {
    if (err) {
        return console.error(err);
    }
    let $ = cheerio.load(res.text);
    var par = $('.wrap-name');
    let temp = {
        'name': $(par).find('h1').text(),
        'grade': $(par).find('.grade').text(),
        'medical': $(par).find('.medical').text(),
        'state': $(par).find('.state').text()

    }
    var info = $('.wrap-info dd');
    temp.alias = $($(info).children('p').get(0)).text();
    temp.type = $($(info).children('p').get(1)).text();
    temp.tel = $($(info).children('p').get(2)).find('em').text();
    temp.address = $($(info).children('p').get(3)).find('em').text();

    hospitals.push(temp)

    console.log(hospitals)

    // if (hosTotal == hosCount) {
    //     console.log('zongshu is ' + hospitals.length)
    //     fs.writeFileSync('./hospitals.json', hospitals);
    // }
})