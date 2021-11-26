'use strict'

const connectDb = require('./db')
const { ObjectId } = require('mongodb')
const errorHandler = require('./errorHandler')

module.exports = {
    createCourse: async (root, { input }) => {
        const defaults = {
            teacher: '',
            topic: ''
        }
        const newCourse = Object.assign(defaults, input)
        let db
        let course
        try {
            db = await connectDb()
            course = await db.collection('courses').insertOne(newCourse)
            newCourse._id = course.insertedId
        } catch (error) {
            errorHandler(error)
        }
        return newCourse
    },
    createPerson: async (root, { input }) => {
        let db
        let student
        try {
            db = await connectDb()
            student = await db.collection('students').insertOne(input)
            input._id = student.insertedId
        } catch (error) {
            errorHandler(error)
        }
        return input
    },
    editCourse: async (root, { _id, input }) => {
        let db
        let course
        try {
            db = await connectDb()
            await db.collection('courses').updateOne(
                { _id: ObjectId(_id) },
                { $set: input }
            )
            course = await db.collection('courses').findOne(
                { _id: ObjectId(_id) }
            )
        } catch (error) {
            errorHandler(error)
        }
        return course
    },
    editPerson: async (root, { _id, input }) => {
        let db
        let student
        try {
            db = await connectDb()
            await db.collection('students').updateOne(
                { _id: ObjectId(_id) },
                { $set: input }
            )
            student = await db.collection('students').findOne(
                { _id: ObjectId(_id) }
            )
        } catch (error) {
            errorHandler(error)
        }
        return student
    },
    addPeople: async (root, { courseID, personID }) => {
        let db
        let course
        let person

        try {
            db = await connectDb()
            course = await db.collection('courses').findOne(
                { _id: ObjectId(courseID) })

            person = await db.collection('students').findOne(
                { _id: ObjectId(personID) })

            if (!course || !person) throw new Error('La Persona o Curso no existe')
            await db.collection('courses').updateOne(
                { _id: ObjectId(courseID) },
                { $addToSet: { people: ObjectId(personID) } }
            )
        } catch (error) {
            errorHandler(error)
        }
        return course
    },
    deleteCourse: async (root, { _id }) => {
        let db

        try {
            db = await connectDb()
            await db.collection('courses').deleteOne(
                { _id: ObjectId(_id) }
            )
        } catch (error) {
            console.error(error)
        }

        return true
    },
    deleteStudent: async (root, {
        _id
    }) => {
        let db

        try {
            db = await connectDb()
            await db.collection('student').deleteOne({
                _id: ObjectId(_id)
            })
        } catch (error) {
            console.error(error)
        }
        return true
    }
}
