const { Question, QuestionCategory } = require('../models/Question');
const User = require('../models/User');
const { NotFoundError, ValidationError } = require('../commons/errors');
const { QUESTION_SCOPE, QUESTION_TYPES } = require('../commons/constants');
const { paginate } = require('../helpers/pagination');

class QuestionService {
  // ============ Category Methods ============

  async createCategory(categoryData, createdBy) {
    const category = new QuestionCategory({
      ...categoryData,
      createdBy,
    });
    await category.save();
    return category;
  }

  async updateCategory(categoryId, updateData) {
    const category = await QuestionCategory.findByIdAndUpdate(
      categoryId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!category) {
      throw new NotFoundError('Question category not found');
    }

    return category;
  }

  async deleteCategory(categoryId) {
    // Check if category has questions
    const hasQuestions = await Question.exists({ category: categoryId });
    if (hasQuestions) {
      throw new ValidationError('Cannot delete category with existing questions');
    }

    const category = await QuestionCategory.findByIdAndDelete(categoryId);
    if (!category) {
      throw new NotFoundError('Question category not found');
    }

    return category;
  }

  async listCategories(options = {}) {
    const filter = {};
    if (!options.includeInactive) {
      filter.isActive = true;
    }

    return QuestionCategory.find(filter)
      .sort({ order: 1, createdAt: 1 })
      .populate('createdBy', 'firstName lastName');
  }

  async getCategoryById(categoryId) {
    const category = await QuestionCategory.findById(categoryId)
      .populate('createdBy', 'firstName lastName');

    if (!category) {
      throw new NotFoundError('Question category not found');
    }

    return category;
  }

  // ============ Question Methods ============

  async createQuestion(questionData, createdBy) {
    // Validate options for select/multiselect/radio types
    if ([QUESTION_TYPES.SELECT, QUESTION_TYPES.MULTISELECT, QUESTION_TYPES.RADIO].includes(questionData.questionType)) {
      if (!questionData.options || questionData.options.length === 0) {
        throw new ValidationError('Options are required for select, multiselect, and radio question types');
      }
    }

    const question = new Question({
      ...questionData,
      createdBy,
    });
    await question.save();
    return question.populate('category');
  }

  async updateQuestion(questionId, updateData) {
    const question = await Question.findByIdAndUpdate(
      questionId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('category');

    if (!question) {
      throw new NotFoundError('Question not found');
    }

    return question;
  }

  async deleteQuestion(questionId) {
    const question = await Question.findByIdAndDelete(questionId);
    if (!question) {
      throw new NotFoundError('Question not found');
    }

    return question;
  }

  async getQuestionById(questionId) {
    const question = await Question.findById(questionId)
      .populate('category')
      .populate('createdBy', 'firstName lastName')
      .populate('conditionalDisplay.dependsOn', 'questionText');

    if (!question) {
      throw new NotFoundError('Question not found');
    }

    return question;
  }

  async listQuestions(query = {}, options = {}) {
    const filter = {};

    // Status filter
    if (!query.includeInactive) {
      filter.isActive = true;
    }

    // Category filter
    if (query.category) {
      filter.category = query.category;
    }

    // Scope filter
    if (query.scope) {
      filter.scope = query.scope;
    }

    // Church filter
    if (query.churchId) {
      filter.$or = [
        { scope: QUESTION_SCOPE.GLOBAL },
        { scope: QUESTION_SCOPE.CHURCH_SPECIFIC, churches: query.churchId }
      ];
    }

    // Target audience filter
    if (query.targetAudience) {
      filter.targetAudience = query.targetAudience;
    }

    const result = await paginate(
      Question,
      filter,
      {
        page: options.page || 1,
        limit: options.limit || 50,
        sort: { 'category.order': 1, order: 1 },
        populate: [
          { path: 'category' },
          { path: 'createdBy', select: 'firstName lastName' },
        ],
      }
    );

    return result;
  }

  // ============ Registration Form Methods ============

  /**
   * Get questions for registration form
   * Returns questions appropriate for the church and user type
   */
  async getRegistrationQuestions(churchId = null, userType = 'all', lang = 'es') {
    const filter = {
      isActive: true,
    };

    // Church-specific or global questions
    if (churchId) {
      filter.$or = [
        { scope: QUESTION_SCOPE.GLOBAL },
        { scope: QUESTION_SCOPE.CHURCH_SPECIFIC, churches: churchId }
      ];
    } else {
      filter.scope = QUESTION_SCOPE.GLOBAL;
    }

    // Target audience filter
    if (userType !== 'all') {
      filter.$and = filter.$and || [];
      filter.$and.push({
        $or: [
          { targetAudience: 'all' },
          { targetAudience: userType }
        ]
      });
    }

    const questions = await Question.find(filter)
      .populate('category')
      .populate('conditionalDisplay.dependsOn', 'questionText')
      .sort({ order: 1 });

    // Group by category and localize
    const categorizedQuestions = this._groupByCategory(questions, lang);

    return categorizedQuestions;
  }

  /**
   * Get questions grouped by category with localization
   */
  _groupByCategory(questions, lang = 'es') {
    const categorized = {};
    const uncategorized = [];

    questions.forEach(question => {
      const localizedQuestion = this._localizeQuestion(question, lang);

      if (question.category) {
        const categoryId = question.category._id.toString();
        if (!categorized[categoryId]) {
          categorized[categoryId] = {
            category: {
              id: categoryId,
              name: question.category.name[lang] || question.category.name.es,
              description: question.category.description?.[lang] || question.category.description?.es,
              order: question.category.order,
            },
            questions: [],
          };
        }
        categorized[categoryId].questions.push(localizedQuestion);
      } else {
        uncategorized.push(localizedQuestion);
      }
    });

    // Convert to array and sort by category order
    const result = Object.values(categorized)
      .sort((a, b) => a.category.order - b.category.order);

    // Add uncategorized at the end if any
    if (uncategorized.length > 0) {
      result.push({
        category: {
          id: null,
          name: lang === 'es' ? 'Otras preguntas' : lang === 'pt' ? 'Outras perguntas' : 'Other questions',
          description: null,
          order: 999,
        },
        questions: uncategorized,
      });
    }

    return result;
  }

  /**
   * Localize question to specified language
   */
  _localizeQuestion(question, lang = 'es') {
    return {
      id: question._id,
      questionText: question.questionText[lang] || question.questionText.es,
      questionType: question.questionType,
      placeholder: question.placeholder?.[lang] || question.placeholder?.es || '',
      helpText: question.helpText?.[lang] || question.helpText?.es || '',
      validation: question.validation,
      order: question.order,
      options: question.options?.map(opt => ({
        value: opt.value,
        label: opt.labels[lang] || opt.labels.es || opt.value,
      })).sort((a, b) => a.order - b.order) || [],
      conditionalDisplay: question.conditionalDisplay?.dependsOn ? {
        dependsOn: question.conditionalDisplay.dependsOn._id,
        showWhenValue: question.conditionalDisplay.showWhenValue,
      } : null,
    };
  }

  // ============ Answer Submission Methods ============

  /**
   * Submit questionnaire answers for a user
   */
  async submitAnswers(userId, answers, churchId = null) {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Validate answers
    const questionIds = answers.map(a => a.questionId);
    const questions = await Question.find({ _id: { $in: questionIds } });

    const validatedAnswers = [];
    for (const answer of answers) {
      const question = questions.find(q => q._id.toString() === answer.questionId);
      if (!question) {
        throw new ValidationError(`Question ${answer.questionId} not found`);
      }

      // Validate required fields
      if (question.validation?.isRequired && (answer.answer === null || answer.answer === undefined || answer.answer === '')) {
        throw new ValidationError(`Question "${question.questionText.es}" is required`);
      }

      // Validate answer format based on question type
      this._validateAnswer(question, answer.answer);

      validatedAnswers.push({
        questionId: answer.questionId,
        answer: answer.answer,
        answeredAt: new Date(),
      });
    }

    // Update user's registration answers
    user.registrationAnswers = validatedAnswers;
    user.registrationCompleted = true;
    user.registrationCompletedAt = new Date();

    await user.save();

    return {
      success: true,
      answersCount: validatedAnswers.length,
      completedAt: user.registrationCompletedAt,
    };
  }

  /**
   * Validate answer based on question type
   */
  _validateAnswer(question, answer) {
    if (answer === null || answer === undefined || answer === '') {
      return; // Skip validation for empty non-required answers
    }

    const { questionType, validation, options } = question;

    switch (questionType) {
      case QUESTION_TYPES.NUMBER:
        if (isNaN(Number(answer))) {
          throw new ValidationError(`Invalid number for question "${question.questionText.es}"`);
        }
        if (validation?.min !== undefined && Number(answer) < validation.min) {
          throw new ValidationError(`Answer must be at least ${validation.min}`);
        }
        if (validation?.max !== undefined && Number(answer) > validation.max) {
          throw new ValidationError(`Answer must be at most ${validation.max}`);
        }
        break;

      case QUESTION_TYPES.EMAIL:
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(answer)) {
          throw new ValidationError(`Invalid email format`);
        }
        break;

      case QUESTION_TYPES.SELECT:
      case QUESTION_TYPES.RADIO:
        const validValues = options.map(o => o.value);
        if (!validValues.includes(answer)) {
          throw new ValidationError(`Invalid option selected`);
        }
        break;

      case QUESTION_TYPES.MULTISELECT:
      case QUESTION_TYPES.CHECKBOX:
        if (!Array.isArray(answer)) {
          throw new ValidationError(`Answer must be an array for multi-select questions`);
        }
        const validMultiValues = options.map(o => o.value);
        for (const val of answer) {
          if (!validMultiValues.includes(val)) {
            throw new ValidationError(`Invalid option selected: ${val}`);
          }
        }
        break;

      case QUESTION_TYPES.TEXT:
      case QUESTION_TYPES.TEXTAREA:
        if (validation?.minLength && answer.length < validation.minLength) {
          throw new ValidationError(`Answer must be at least ${validation.minLength} characters`);
        }
        if (validation?.maxLength && answer.length > validation.maxLength) {
          throw new ValidationError(`Answer must be at most ${validation.maxLength} characters`);
        }
        if (validation?.regex) {
          const regex = new RegExp(validation.regex);
          if (!regex.test(answer)) {
            throw new ValidationError(validation.regexMessage?.es || 'Invalid format');
          }
        }
        break;

      case QUESTION_TYPES.DATE:
        if (isNaN(Date.parse(answer))) {
          throw new ValidationError(`Invalid date format`);
        }
        break;
    }
  }

  /**
   * Get user's answers
   */
  async getUserAnswers(userId, lang = 'es') {
    const user = await User.findById(userId)
      .populate('registrationAnswers.questionId');

    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (!user.registrationAnswers || user.registrationAnswers.length === 0) {
      return {
        completed: false,
        answers: [],
      };
    }

    const answers = user.registrationAnswers.map(ra => {
      const question = ra.questionId;
      return {
        questionId: question._id,
        questionText: question.questionText[lang] || question.questionText.es,
        questionType: question.questionType,
        answer: ra.answer,
        answeredAt: ra.answeredAt,
      };
    });

    return {
      completed: user.registrationCompleted,
      completedAt: user.registrationCompletedAt,
      answers,
    };
  }

  /**
   * Get all answers for a specific question (admin view)
   */
  async getAnswersForQuestion(questionId, options = {}) {
    const question = await Question.findById(questionId);
    if (!question) {
      throw new NotFoundError('Question not found');
    }

    const result = await paginate(
      User,
      { 'registrationAnswers.questionId': questionId },
      {
        page: options.page || 1,
        limit: options.limit || 50,
        select: 'firstName lastName email registrationAnswers',
      }
    );

    // Extract only the relevant answer from each user
    result.docs = result.docs.map(user => {
      const answer = user.registrationAnswers.find(
        a => a.questionId.toString() === questionId
      );
      return {
        userId: user._id,
        userName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        answer: answer?.answer,
        answeredAt: answer?.answeredAt,
      };
    });

    return result;
  }

  // ============ Reorder Methods ============

  async reorderCategories(categoryOrders) {
    const updates = categoryOrders.map(({ categoryId, order }) =>
      QuestionCategory.updateOne(
        { _id: categoryId },
        { $set: { order } }
      )
    );

    await Promise.all(updates);
    return this.listCategories();
  }

  async reorderQuestions(questionOrders) {
    const updates = questionOrders.map(({ questionId, order }) =>
      Question.updateOne(
        { _id: questionId },
        { $set: { order } }
      )
    );

    await Promise.all(updates);
    return true;
  }

  // ============ Statistics ============

  async getQuestionStatistics(questionId) {
    const question = await Question.findById(questionId);
    if (!question) {
      throw new NotFoundError('Question not found');
    }

    // Count total answers
    const totalAnswers = await User.countDocuments({
      'registrationAnswers.questionId': questionId,
    });

    // For select/radio/multiselect, get answer distribution
    let distribution = null;
    if ([QUESTION_TYPES.SELECT, QUESTION_TYPES.RADIO, QUESTION_TYPES.MULTISELECT, QUESTION_TYPES.CHECKBOX].includes(question.questionType)) {
      const pipeline = [
        { $unwind: '$registrationAnswers' },
        { $match: { 'registrationAnswers.questionId': question._id } },
        { $group: {
          _id: '$registrationAnswers.answer',
          count: { $sum: 1 },
        }},
        { $sort: { count: -1 } },
      ];

      distribution = await User.aggregate(pipeline);
    }

    return {
      questionId,
      questionText: question.questionText,
      questionType: question.questionType,
      totalAnswers,
      distribution,
    };
  }
}

module.exports = new QuestionService();
