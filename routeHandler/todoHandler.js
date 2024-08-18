const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const todoSchema = require('../schemas/todoSchema');

const Todo = new mongoose.model('Todo', todoSchema);
const checkLogin = require('../middleware/checkLogin');

// GET ALL THE TODOS
router.get('/', checkLogin, async (req, res) => {
    try {
        const data = await Todo.find({ status: 'active' })
            .select({
                _id: 0,
                __v: 0,
                date: 0,
            })
            .limit(2)
            .exec();

        res.status(200).json({
            result: data,
            message: 'Success',
        });
    } catch (err) {
        res.status(500).json({
            error: 'There was a server side error!',
        });
    }
});

// GET A TODO by ID
router.get('/:id', async (req, res) => {
    await Todo.find({ _id: req.params.id }, (err, data) => {
        if (err) {
            res.status(500).json({
                error: 'There was a server side error!',
            });
        } else {
            res.status(200).json({
                result: data,
                message: 'Success',
            });
        }
    });
});

router.post('/', async (req, res) => {
    try {
        const newTodo = new Todo(req.body);
        await newTodo.save();
        res.status(200).json({
            message: 'Todo was inserted successfully!',
        });
    } catch (err) {
        res.status(500).json(err.message);
    }
});

// POST MULTIPLE TODO
router.post('/all', async (req, res) => {
    try {
        await Todo.insertMany(req.body);
        res.status(200).json({
            message: 'Todos were inserted successfully!',
        });
    } catch (err) {
        res.status(500).json({
            error: 'There was a server side error!',
        });
    }
});

// PUT TODO
router.put('/:id', async (req, res) => {
    const result = await Todo.findByIdAndUpdate(
        { _id: req.params.id },
        {
            $set: {
                status: 'active',
            },
        },
        {
            new: true,
            useFindAndModify: false,
        },
        (err) => {
            if (err) {
                res.status(500).json({
                    error: 'There was a server side error!',
                });
            } else {
                res.status(200).json({
                    message: 'Todo was updated successfully!',
                });
            }
        }
    );
    console.log(result);
});

// DELETE TODO
router.delete('/:id', async (req, res) => {
    await Todo.deleteOne({ _id: req.params.id }, (err) => {
        if (err) {
            res.status(500).json({
                error: 'There was a server side error!',
            });
        } else {
            res.status(200).json({
                message: 'Todo was deleted successfully!',
            });
        }
    });
});

module.exports = router;
