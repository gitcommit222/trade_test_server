import jwt from "jsonwebtoken";

export const auth = async (req, res, next) => {
	try {
		// Safely check if authorization header and token exist
		const token = req.headers?.authorization?.split(" ")[1];

		// If no token is provided, return a 401 error
		if (!token) {
			return res.status(401).json({ message: "Authorization token missing" });
		}

		const isCustomAuth = token.length < 500; // Assuming tokens < 500 are custom tokens (e.g. JWT)

		let decodedData;

		if (isCustomAuth) {
			// Custom token (e.g. JWT created by your server)
			decodedData = jwt.verify(token, process.env.JWT_SECRET); // Verify the token with your secret

			req.user = decodedData; // Attach decoded user data to the request
		} else {
			// OAuth token (e.g. Google JWT)
			decodedData = jwt.decode(token); // Decode the token without verifying

			req.userId = decodedData?.sub; // Attach Google user ID (sub) to the request
		}

		next(); // Proceed to the next middleware or route handler
	} catch (error) {
		// Log any errors for debugging
		console.log("Authentication error:", error);
		res.status(403).json({ message: "Invalid or expired token" }); // Return error response
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
