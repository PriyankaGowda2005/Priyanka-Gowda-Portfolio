const express = require('express');
const router = express.Router();
const Message = require('../models/message');
const sendEmail = require('../utils/mailer');

// @route   POST /api/contact
// @desc    Send a contact message
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate input
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, error: 'Please provide all required fields' });
    }

    // Create message in database
    const newMessage = await Message.create({
      name,
      email,
      subject,
      message,
    });

    // Send email notification
    await sendEmail({
      name,
      email,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      data: newMessage,
      message: 'Message sent successfully',
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, error: errors[0] });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
});

// @route   GET /api/contact
// @desc    Get all messages (protected in production)
// @access  Private (This should be protected with authentication in production)
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
});

// @route   PUT /api/contact/:id
// @desc    Mark a message as read
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found',
      });
    }
    
    message.read = true;
    await message.save();
    
    res.status(200).json({
      success: true,
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
});

// @route   DELETE /api/contact/:id
// @desc    Delete a message
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found',
      });
    }
    
    await message.remove();
    
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
});

module.exports = router;