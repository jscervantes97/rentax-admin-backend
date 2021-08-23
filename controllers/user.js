const User = require('../models/user');
const AppError = require('../utils/appError');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res
      .status(200)
      .json({ status: 'success', results: users.length, data: { users } });
  } catch (error) {
    next(error);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate('trees');

    if (!user) {
      return next(new AppError('No user found with that ID', 404));
    }

    res.status(200).json({ status: 'success', data: { user } });
  } catch (error) {
    next(error);
  }
};

exports.updateMe = async (req, res, next) => {
  try {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          'This route is not for password updates. Plase use /updateMyPassword.',
          400
        )
      );
    }

    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email', 'image');

    console.log(req.body.image);

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteMyUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

exports.sendQuoteRequest = async (req, res, next) => {
  const { name, surname, email, phone, priceRange, development, term, typeOfCredit, additionalInfo } = req.body;

  const msg = {
    to: 'mxhousesin@gmail.com',
    from: 'mxhousesin@gmail.com', // Use the email address or domain you verified above
    subject: 'Solicitud de cotización desde el website',
    text: 'Solicitud de cotización desde el website',
    html: `
      <h1>Solicitud de cotización</h1>
      <ul>
        <li>Nombre: ${name} ${surname}</li>
        <li>Correo electrónico: ${email}</li>
        <li>Teléfono: ${phone}</li>
        <li>Rango de precio: ${priceRange}</li>
        <li>Desarrollo: ${development}</li>
        <li>Plazo: ${term}</li>
        <li>Tipo de credito: ${typeOfCredit}</li>
        <li>Información adicional: ${additionalInfo}</li>
      </ul>
    `
  };

  sgMail
  .send(msg)
  .then(() => {
    res.status(200).json({ status: 'Quotation requested', data: { msg } });
  }, error => {
    next(error.response);

    console.error(error);

    if (error.response) {
      console.error(error.response.body);
    }
  });

};

exports.sendCustomerRef = async (req, res, next) => {
  const { customerName, customerPhone, customerEmail, prospectName, prospectPhone, prospectEmail, additionalInfo } = req.body;

  const msg = {
    to: 'mxhousesin@gmail.com',
    from: 'mxhousesin@gmail.com', // Use the email address or domain you verified above
    subject: 'Recomendación de cliente',
    text: 'Recomendación de cliente',
    html: `
      <h1>Recomendación de cliente</h1>
      <ul>
        <li>Nombre del cliente: ${customerName}</li>
        <li>Correo electrónico: ${customerEmail}</li>
        <li>Teléfono: ${customerPhone}</li>
        <li>Nombre del recomendado: ${prospectName}</li>
        <li>Correo electrónico: ${prospectEmail}</li>
        <li>Teléfono: ${prospectPhone}</li>
        <li>Información adicional: ${additionalInfo}</li>
      </ul>
    `
  };

  sgMail
  .send(msg)
  .then(() => {
    res.status(200).json({ status: 'Customer reference sent', data: { msg } });
  }, error => {
    next(error.response);

    console.error(error);

    if (error.response) {
      console.error(error.response.body);
    }
  });

};
