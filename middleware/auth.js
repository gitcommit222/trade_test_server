import jwt from "jsonwebtoken";

export const auth = async (req, res, next) => {
	try {
		const token = req.headers?.authorization?.split(" ")[1];
		const isCustomAuth = token.length < 500;

		let decodedData;

		if (token && isCustomAuth) {
			decodedData = jwt.verify(token, process.env.JWT_SECRET);

			req.user = decodedData;
		} else {
			decodedData = jwt.decode(token);

			res.userId = decodedData?.sub;
		}

		next();
	} catch (error) {
		console.log(error);
	}
};

// validate user roles
export const authorizeRoles = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user?.role || "")) {
			return res.status(
				400,
				`Role: ${req.user?.role} is not allowed to access this resource`
			);
		}
		next();
	};
};
