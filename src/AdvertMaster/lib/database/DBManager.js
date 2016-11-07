/**
 * Created by liuxun on 16/11/7.
 */
const express = require("express");
const mysql = require("mysql");

let config = {
    "host":"localhost",
    "database":""
};

const DBManager = function(){
    const db_conn = mysql.con;
};


exports.DBManager = new DBManager();