// const express = require('express')
// const Employee = require('../models/Employee')
// const User = require('../models/User')
// //show list
// const index= (req,res, next) => {
//     User.find()
//     .then(response => {
//         res.json({
//             response
//         })
//     })
//     .catch(error => {
//         res.json({
//             message: 'an error occured!'
//         })
//     })
// }
// //show employee by id
// const show = (req,res,next) => {
//     let employeeID = req.body.employeeID
//     User.findById(employeeID)
//     .then(response=> {
//         res.json({
//             response
//         })
//     })
//     .catch(error => {
//         res.json({
//             message: 'an error occured!'
//         })
//     })
// }

// const store = (req,res,next) => {
//     let employee = new Employee({
//         name: req.body.name,
//         email: req.body.email,
//         age: req.body.age
//     })
//     if(req.file){
//         employee.avatar = req.file.path
//     }
//     employee.save()
//     .then(response => {
//         res.json({
//             message: 'employee added'
//         })
//     })
//     .catch(error => {
//         res.json({
//             message: 'an error occured!'
//         })
//     })
// }

// //update an employee

// const update = (req, res, next) => {
//     let employeeID= req.body.employeeID

//     let updatedData = {
//         name: req.body.name,
//         email: req.body.email,
//         age: req.body.age
//     }

//     Employee.findByIdandUpdate(employeeID, {$set: updatedData})
//     .then(() => {
//         res.json({
//             message: ' employee updated'
//         })
//     })
//     .catch(error => {
//         res.json({
//             message: 'an error occured!'
//         })
//     })
// }

// //delete

// const destroy = (req,res,next) => {
//     let employeeID = req.body.employeeID
//     Employee.findByIdAndRemove(employeeID)
//     .then(() => {
//         res.json({
//             message: 'employee deleted'
//         })
//     })
//     .catch(error => {
//         req.json({
//             message: 'error occured'
//         })
//     })
// }

// module.exports = {
//     index,show,store,update,destroy
// }
