const { Church } = require('../models');
const logger = require('../helpers/logger');
const { CHURCH_LEVELS, CHURCH_STATUS, SERVICE_TYPES } = require('../commons/constants');

const churches = [
  // BOLIVIA - Headquarters
  {
    name: 'Sede Central Internacional',
    slug: 'sede-central-santa-cruz-bolivia',
    level: CHURCH_LEVELS.HEADQUARTERS,
    isHeadquarters: true,
    region: 'South America',
    country: 'Bolivia',
    department: 'Santa Cruz',
    city: 'Santa Cruz de la Sierra',
    address: 'Calle Chesterton esquina Walt Whitman, Barrio Los Tusequis',
    phone: '(591) 3-3424802',
    email: 'julianoscristoeslarespuesta@gmail.com',
    socialMedia: {
      youtube: 'CRISTOESLARESPUESTAOFICIAL',
      blog: 'https://difundiendolaverdad.blogspot.com'
    },
    foundedDate: new Date('1969-09-24'),
    foundedBy: 'Misioneros ordenados enviados desde Chile',
    history: {
      es: 'La obra comenzó cuando una pareja de teólogos recién ordenados fueron enviados a Chile como misioneros. Después de escuchar el llamado de Dios a Bolivia, llegaron a Santa Cruz de la Sierra el 18 de septiembre de 1969. Comenzaron a predicar en el humilde barrio "El Lazareto", siendo testigos de sanidades y milagros que atrajeron seguidores. El movimiento se expandió por Bolivia y hacia Perú, Brasil, Chile, Argentina y Paraguay.',
      en: 'The work began when a recently ordained theology couple was sent to Chile as missionaries. After hearing God\'s call to Bolivia, they arrived in Santa Cruz de la Sierra on September 18, 1969. They started preaching in the humble neighborhood "El Lazareto," witnessing healings and miracles that attracted followers. The movement expanded across Bolivia and into Peru, Brazil, Chile, Argentina, and Paraguay.',
      pt: 'A obra começou quando um casal de teólogos recém-ordenados foi enviado ao Chile como missionários. Depois de ouvir o chamado de Deus para a Bolívia, chegaram a Santa Cruz de la Sierra em 18 de setembro de 1969. Começaram a pregar no humilde bairro "El Lazareto", testemunhando curas e milagres que atraíram seguidores. O movimento se expandiu pela Bolívia e para o Peru, Brasil, Chile, Argentina e Paraguai.'
    },
    description: {
      es: 'Sede Central Internacional de la Iglesia Cristo Es La Respuesta. Reconocida legalmente mediante Resolución Suprema No. 188425 del 8 de septiembre de 1978 por el Ministerio de Relaciones Exteriores de Bolivia.',
      en: 'International Headquarters of Cristo Es La Respuesta Church. Legally recognized through Supreme Resolution No. 188425 on September 8, 1978 by Bolivia\'s Ministry of Foreign Relations.',
      pt: 'Sede Central Internacional da Igreja Cristo É a Resposta. Reconhecida legalmente através da Resolução Suprema No. 188425 em 8 de setembro de 1978 pelo Ministério das Relações Exteriores da Bolívia.'
    },
    serviceSchedule: [
      {
        dayOfWeek: 0, // Sunday
        type: SERVICE_TYPES.SUNDAY_SERVICE,
        startTime: '10:00',
        endTime: '12:00',
        description: {
          es: 'Servicio Dominical',
          en: 'Sunday Service',
          pt: 'Culto Dominical'
        }
      },
      {
        dayOfWeek: 0, // Sunday
        type: SERVICE_TYPES.SUNDAY_SERVICE,
        startTime: '18:00',
        endTime: '20:00',
        description: {
          es: 'Servicio Dominical Nocturno',
          en: 'Sunday Evening Service',
          pt: 'Culto Dominical Noturno'
        }
      },
      {
        dayOfWeek: 6, // Saturday
        type: SERVICE_TYPES.BIBLE_STUDY,
        startTime: '18:00',
        endTime: '20:00',
        description: {
          es: 'Estudio Bíblico',
          en: 'Bible Study',
          pt: 'Estudo Bíblico'
        }
      }
    ],
    status: CHURCH_STATUS.ACTIVE,
    settings: {
      defaultLanguage: 'es',
      timezone: 'America/La_Paz',
      allowMemberRegistration: true,
      requireApproval: true
    }
  },

  // BOLIVIA - Cochabamba
  {
    name: 'Iglesia de Cochabamba',
    slug: 'cochabamba-bolivia',
    level: CHURCH_LEVELS.DEPARTMENT,
    isHeadquarters: false,
    region: 'South America',
    country: 'Bolivia',
    department: 'Cochabamba',
    city: 'Cochabamba',
    address: 'Av. Barrancas, entre Jose María Valda y Dionisio Bobadilla',
    foundedDate: new Date('1972-10-14'),
    description: {
      es: 'Iglesia Cristo Es La Respuesta de Cochabamba, Bolivia.',
      en: 'Cristo Es La Respuesta Church of Cochabamba, Bolivia.',
      pt: 'Igreja Cristo É a Resposta de Cochabamba, Bolívia.'
    },
    serviceSchedule: [
      {
        dayOfWeek: 0,
        type: SERVICE_TYPES.SUNDAY_SERVICE,
        startTime: '10:00',
        endTime: '12:00',
        description: {
          es: 'Servicio Dominical',
          en: 'Sunday Service',
          pt: 'Culto Dominical'
        }
      }
    ],
    status: CHURCH_STATUS.ACTIVE,
    settings: {
      defaultLanguage: 'es',
      timezone: 'America/La_Paz',
      allowMemberRegistration: true,
      requireApproval: true
    }
  },

  // BOLIVIA - La Paz
  {
    name: 'Iglesia de La Paz',
    slug: 'la-paz-bolivia',
    level: CHURCH_LEVELS.DEPARTMENT,
    isHeadquarters: false,
    region: 'South America',
    country: 'Bolivia',
    department: 'La Paz',
    city: 'La Paz',
    address: 'Villa Adela, cerca de Av. Circunvalación',
    description: {
      es: 'Iglesia Cristo Es La Respuesta de La Paz, Bolivia.',
      en: 'Cristo Es La Respuesta Church of La Paz, Bolivia.',
      pt: 'Igreja Cristo É a Resposta de La Paz, Bolívia.'
    },
    serviceSchedule: [
      {
        dayOfWeek: 0,
        type: SERVICE_TYPES.SUNDAY_SERVICE,
        startTime: '10:00',
        endTime: '12:00',
        description: {
          es: 'Servicio Dominical',
          en: 'Sunday Service',
          pt: 'Culto Dominical'
        }
      }
    ],
    status: CHURCH_STATUS.ACTIVE,
    settings: {
      defaultLanguage: 'es',
      timezone: 'America/La_Paz',
      allowMemberRegistration: true,
      requireApproval: true
    }
  },

  // ARGENTINA - Buenos Aires
  {
    name: 'Iglesia de Buenos Aires',
    slug: 'buenos-aires-argentina',
    level: CHURCH_LEVELS.COUNTRY,
    isHeadquarters: false,
    region: 'South America',
    country: 'Argentina',
    department: 'Buenos Aires',
    city: 'Buenos Aires',
    address: 'Calle Chañar, entre Arenales y Rio Negro',
    phone: '+549 11 31415153',
    foundedDate: new Date('2002-10-21'),
    description: {
      es: 'Iglesia Cristo Es La Respuesta de Buenos Aires, Argentina.',
      en: 'Cristo Es La Respuesta Church of Buenos Aires, Argentina.',
      pt: 'Igreja Cristo É a Resposta de Buenos Aires, Argentina.'
    },
    serviceSchedule: [
      {
        dayOfWeek: 0,
        type: SERVICE_TYPES.SUNDAY_SERVICE,
        startTime: '10:00',
        endTime: '12:00',
        description: {
          es: 'Servicio Dominical',
          en: 'Sunday Service',
          pt: 'Culto Dominical'
        }
      }
    ],
    status: CHURCH_STATUS.ACTIVE,
    settings: {
      defaultLanguage: 'es',
      timezone: 'America/Argentina/Buenos_Aires',
      allowMemberRegistration: true,
      requireApproval: true
    }
  },

  // ARGENTINA - Embarcación (Salta)
  {
    name: 'Iglesia de Embarcación',
    slug: 'embarcacion-salta-argentina',
    level: CHURCH_LEVELS.PROVINCE,
    isHeadquarters: false,
    region: 'South America',
    country: 'Argentina',
    department: 'Salta',
    province: 'General José de San Martín',
    city: 'Embarcación',
    address: 'Calle Santos Vega, entre Pasaje 1 y Pasaje 2',
    description: {
      es: 'Iglesia Cristo Es La Respuesta de Embarcación, Salta, Argentina.',
      en: 'Cristo Es La Respuesta Church of Embarcación, Salta, Argentina.',
      pt: 'Igreja Cristo É a Resposta de Embarcación, Salta, Argentina.'
    },
    serviceSchedule: [
      {
        dayOfWeek: 0,
        type: SERVICE_TYPES.SUNDAY_SERVICE,
        startTime: '10:00',
        endTime: '12:00',
        description: {
          es: 'Servicio Dominical',
          en: 'Sunday Service',
          pt: 'Culto Dominical'
        }
      }
    ],
    status: CHURCH_STATUS.ACTIVE,
    settings: {
      defaultLanguage: 'es',
      timezone: 'America/Argentina/Salta',
      allowMemberRegistration: true,
      requireApproval: true
    }
  }
];

const seed = async () => {
  try {
    logger.info('Starting church seeder...');

    // Check if churches already exist
    const existingCount = await Church.countDocuments();
    if (existingCount > 0) {
      logger.info(`Churches already seeded (${existingCount} found). Skipping...`);
      return;
    }

    // Find headquarters first to set parent relationships
    const headquartersData = churches.find(c => c.isHeadquarters);
    const headquarters = await Church.create(headquartersData);
    logger.info(`Created headquarters: ${headquarters.name}`);

    // Create other churches with parent reference to headquarters or country church
    const otherChurches = churches.filter(c => !c.isHeadquarters);

    for (const churchData of otherChurches) {
      // Set parent church based on hierarchy
      if (churchData.level === CHURCH_LEVELS.COUNTRY || churchData.level === CHURCH_LEVELS.DEPARTMENT) {
        // Country and department level churches report to headquarters
        if (churchData.country === 'Bolivia') {
          churchData.parentChurch = headquarters._id;
        }
      } else if (churchData.level === CHURCH_LEVELS.PROVINCE || churchData.level === CHURCH_LEVELS.LOCAL) {
        // Find the department or country church as parent
        const parentChurch = await Church.findOne({
          country: churchData.country,
          $or: [
            { level: CHURCH_LEVELS.DEPARTMENT, department: churchData.department },
            { level: CHURCH_LEVELS.COUNTRY }
          ]
        });
        if (parentChurch) {
          churchData.parentChurch = parentChurch._id;
        } else {
          churchData.parentChurch = headquarters._id;
        }
      }

      const church = await Church.create(churchData);
      logger.info(`Created church: ${church.name} (${church.level})`);
    }

    // Set Argentina churches' parent to Buenos Aires
    const buenosAires = await Church.findOne({ slug: 'buenos-aires-argentina' });
    if (buenosAires) {
      await Church.updateMany(
        { country: 'Argentina', level: { $in: [CHURCH_LEVELS.PROVINCE, CHURCH_LEVELS.LOCAL] } },
        { parentChurch: buenosAires._id }
      );
    }

    const totalChurches = await Church.countDocuments();
    logger.info(`Church seeder completed. Total churches: ${totalChurches}`);

  } catch (error) {
    logger.error('Church seeder failed:', error);
    throw error;
  }
};

const clear = async () => {
  try {
    await Church.deleteMany({});
    logger.info('Churches cleared');
  } catch (error) {
    logger.error('Failed to clear churches:', error);
    throw error;
  }
};

module.exports = { seed, clear, churches };
