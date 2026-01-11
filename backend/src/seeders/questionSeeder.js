const { Question, QuestionCategory } = require('../models');
const logger = require('../helpers/logger');
const { QUESTION_TYPES, QUESTION_SCOPE, QUESTION_AUDIENCE } = require('../commons/constants');

const categories = [
  {
    name: {
      es: 'Información Personal',
      en: 'Personal Information',
      pt: 'Informação Pessoal'
    },
    description: {
      es: 'Información básica sobre usted',
      en: 'Basic information about yourself',
      pt: 'Informação básica sobre você'
    },
    order: 1
  },
  {
    name: {
      es: 'Ubicación',
      en: 'Location',
      pt: 'Localização'
    },
    description: {
      es: 'Dónde se encuentra ubicado',
      en: 'Where you are located',
      pt: 'Onde você está localizado'
    },
    order: 2
  },
  {
    name: {
      es: 'Interés Espiritual',
      en: 'Spiritual Interest',
      pt: 'Interesse Espiritual'
    },
    description: {
      es: 'Sobre su interés en la iglesia',
      en: 'About your interest in the church',
      pt: 'Sobre seu interesse na igreja'
    },
    order: 3
  }
];

const getQuestions = (categoryIds) => [
  // Personal Information Questions
  {
    category: categoryIds['Información Personal'],
    questionText: {
      es: '¿Cuál es su nombre completo?',
      en: 'What is your full name?',
      pt: 'Qual é o seu nome completo?'
    },
    questionType: QUESTION_TYPES.TEXT,
    validation: {
      isRequired: true,
      minLength: 3,
      maxLength: 100
    },
    placeholder: {
      es: 'Ej: Juan Pérez García',
      en: 'E.g.: John Smith',
      pt: 'Ex: João da Silva'
    },
    order: 1,
    scope: QUESTION_SCOPE.GLOBAL,
    targetAudience: QUESTION_AUDIENCE.ALL
  },
  {
    category: categoryIds['Información Personal'],
    questionText: {
      es: '¿Cuál es su número de teléfono?',
      en: 'What is your phone number?',
      pt: 'Qual é o seu número de telefone?'
    },
    questionType: QUESTION_TYPES.PHONE,
    validation: {
      isRequired: false
    },
    placeholder: {
      es: 'Ej: +591 70000000',
      en: 'E.g.: +1 555-123-4567',
      pt: 'Ex: +55 11 99999-9999'
    },
    order: 2,
    scope: QUESTION_SCOPE.GLOBAL,
    targetAudience: QUESTION_AUDIENCE.ALL
  },
  {
    category: categoryIds['Información Personal'],
    questionText: {
      es: '¿Cuál es su fecha de nacimiento?',
      en: 'What is your date of birth?',
      pt: 'Qual é a sua data de nascimento?'
    },
    questionType: QUESTION_TYPES.DATE,
    validation: {
      isRequired: false
    },
    order: 3,
    scope: QUESTION_SCOPE.GLOBAL,
    targetAudience: QUESTION_AUDIENCE.ALL
  },

  // Location Questions
  {
    category: categoryIds['Ubicación'],
    questionText: {
      es: '¿En qué país vive actualmente?',
      en: 'In which country do you currently live?',
      pt: 'Em que país você mora atualmente?'
    },
    questionType: QUESTION_TYPES.SELECT,
    options: [
      { value: 'bolivia', labels: { es: 'Bolivia', en: 'Bolivia', pt: 'Bolívia' }, order: 1 },
      { value: 'argentina', labels: { es: 'Argentina', en: 'Argentina', pt: 'Argentina' }, order: 2 },
      { value: 'brasil', labels: { es: 'Brasil', en: 'Brazil', pt: 'Brasil' }, order: 3 },
      { value: 'chile', labels: { es: 'Chile', en: 'Chile', pt: 'Chile' }, order: 4 },
      { value: 'peru', labels: { es: 'Perú', en: 'Peru', pt: 'Peru' }, order: 5 },
      { value: 'paraguay', labels: { es: 'Paraguay', en: 'Paraguay', pt: 'Paraguai' }, order: 6 },
      { value: 'other', labels: { es: 'Otro', en: 'Other', pt: 'Outro' }, order: 99 }
    ],
    validation: {
      isRequired: true
    },
    order: 1,
    scope: QUESTION_SCOPE.GLOBAL,
    targetAudience: QUESTION_AUDIENCE.ALL
  },
  {
    category: categoryIds['Ubicación'],
    questionText: {
      es: '¿En qué ciudad vive?',
      en: 'In which city do you live?',
      pt: 'Em que cidade você mora?'
    },
    questionType: QUESTION_TYPES.TEXT,
    validation: {
      isRequired: true,
      minLength: 2,
      maxLength: 100
    },
    placeholder: {
      es: 'Ej: Santa Cruz de la Sierra',
      en: 'E.g.: Santa Cruz de la Sierra',
      pt: 'Ex: Santa Cruz de la Sierra'
    },
    order: 2,
    scope: QUESTION_SCOPE.GLOBAL,
    targetAudience: QUESTION_AUDIENCE.ALL
  },

  // Spiritual Interest Questions
  {
    category: categoryIds['Interés Espiritual'],
    questionText: {
      es: '¿Cómo se enteró de nuestra iglesia?',
      en: 'How did you hear about our church?',
      pt: 'Como você conheceu nossa igreja?'
    },
    questionType: QUESTION_TYPES.SELECT,
    options: [
      { value: 'family', labels: { es: 'Familia', en: 'Family', pt: 'Família' }, order: 1 },
      { value: 'friend', labels: { es: 'Amigo/a', en: 'Friend', pt: 'Amigo/a' }, order: 2 },
      { value: 'social_media', labels: { es: 'Redes sociales', en: 'Social media', pt: 'Redes sociais' }, order: 3 },
      { value: 'internet', labels: { es: 'Búsqueda en internet', en: 'Internet search', pt: 'Busca na internet' }, order: 4 },
      { value: 'event', labels: { es: 'Evento o campaña', en: 'Event or campaign', pt: 'Evento ou campanha' }, order: 5 },
      { value: 'passing_by', labels: { es: 'Pasando por el lugar', en: 'Passing by', pt: 'Passando pelo local' }, order: 6 },
      { value: 'other', labels: { es: 'Otro', en: 'Other', pt: 'Outro' }, order: 99 }
    ],
    validation: {
      isRequired: true
    },
    order: 1,
    scope: QUESTION_SCOPE.GLOBAL,
    targetAudience: QUESTION_AUDIENCE.NEW_VISITORS
  },
  {
    category: categoryIds['Interés Espiritual'],
    questionText: {
      es: '¿Por qué le interesa conocer más de nuestra iglesia?',
      en: 'Why are you interested in learning more about our church?',
      pt: 'Por que você está interessado em conhecer mais sobre nossa igreja?'
    },
    questionType: QUESTION_TYPES.TEXTAREA,
    validation: {
      isRequired: false,
      maxLength: 500
    },
    placeholder: {
      es: 'Comparta su motivación...',
      en: 'Share your motivation...',
      pt: 'Compartilhe sua motivação...'
    },
    helpText: {
      es: 'Esta información nos ayuda a servirle mejor',
      en: 'This information helps us serve you better',
      pt: 'Esta informação nos ajuda a servi-lo melhor'
    },
    order: 2,
    scope: QUESTION_SCOPE.GLOBAL,
    targetAudience: QUESTION_AUDIENCE.NEW_VISITORS
  },
  {
    category: categoryIds['Interés Espiritual'],
    questionText: {
      es: '¿Ha asistido a alguna otra iglesia anteriormente?',
      en: 'Have you attended any other church before?',
      pt: 'Você já frequentou alguma outra igreja anteriormente?'
    },
    questionType: QUESTION_TYPES.RADIO,
    options: [
      { value: 'yes', labels: { es: 'Sí', en: 'Yes', pt: 'Sim' }, order: 1 },
      { value: 'no', labels: { es: 'No', en: 'No', pt: 'Não' }, order: 2 }
    ],
    validation: {
      isRequired: false
    },
    order: 3,
    scope: QUESTION_SCOPE.GLOBAL,
    targetAudience: QUESTION_AUDIENCE.NEW_VISITORS
  },
  {
    category: categoryIds['Interés Espiritual'],
    questionText: {
      es: '¿Le gustaría que un líder de la iglesia se comunique con usted?',
      en: 'Would you like a church leader to contact you?',
      pt: 'Você gostaria que um líder da igreja entre em contato com você?'
    },
    questionType: QUESTION_TYPES.RADIO,
    options: [
      { value: 'yes', labels: { es: 'Sí, por favor', en: 'Yes, please', pt: 'Sim, por favor' }, order: 1 },
      { value: 'later', labels: { es: 'Más adelante', en: 'Maybe later', pt: 'Talvez mais tarde' }, order: 2 },
      { value: 'no', labels: { es: 'No, gracias', en: 'No, thanks', pt: 'Não, obrigado' }, order: 3 }
    ],
    validation: {
      isRequired: false
    },
    order: 4,
    scope: QUESTION_SCOPE.GLOBAL,
    targetAudience: QUESTION_AUDIENCE.ALL
  }
];

const seed = async () => {
  try {
    logger.info('Starting question seeder...');

    // Check if questions already exist
    const existingCount = await Question.countDocuments();
    if (existingCount > 0) {
      logger.info(`Questions already seeded (${existingCount} found). Skipping...`);
      return;
    }

    // Create categories first
    const categoryIds = {};
    for (const categoryData of categories) {
      const category = await QuestionCategory.create({
        ...categoryData,
        isActive: true
      });
      categoryIds[categoryData.name.es] = category._id;
      logger.info(`Created category: ${categoryData.name.es}`);
    }

    // Create questions
    const questions = getQuestions(categoryIds);
    for (const questionData of questions) {
      await Question.create({
        ...questionData,
        isActive: true
      });
    }

    const totalQuestions = await Question.countDocuments();
    logger.info(`Question seeder completed. Total questions: ${totalQuestions}`);

  } catch (error) {
    logger.error('Question seeder failed:', error);
    throw error;
  }
};

const clear = async () => {
  try {
    await Question.deleteMany({});
    await QuestionCategory.deleteMany({});
    logger.info('Questions and categories cleared');
  } catch (error) {
    logger.error('Failed to clear questions:', error);
    throw error;
  }
};

module.exports = { seed, clear };
