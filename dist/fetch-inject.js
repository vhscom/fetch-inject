/**
 * MIT License
 *
 * Copyright (c) 2017 VHS
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var fetchInject=function(){"use strict";const e=function(e,t,n,o,c,r,i){r=t.createElement(n),i=t.getElementsByTagName(n)[0],r.appendChild(t.createTextNode(o)),r.onload=c,i.parentNode.insertBefore(r,i)},t=function(e,t,n,o,c,r,i){r=t.createElement(n),i=t.getElementsByTagName(n)[0],r.type="text/css",r.appendChild(t.createTextNode(o)),i.parentNode.insertBefore(r,i)};return function(n){const o=[],c=[],r=[];return n.forEach(e=>c.push(window.fetch(e).then(e=>{return[e.clone().text(),e.blob()]}).then(e=>{return Promise.all(e).then(e=>{o.push({text:e[0],type:e[1].type})})}))),Promise.all(c).then(()=>{return o.forEach(n=>{r.push({then:o=>{"application/javascript"===n.type?e(window,document,"script",n.text,o()):"text/css"===n.type&&(t(window,document,"style",n.text),o())}})}),Promise.all(r)})}}();
