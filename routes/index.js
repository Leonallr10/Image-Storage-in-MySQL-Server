/*
* GET home page.
*/

exports.index = function(req, res) {
    let message = '';
    
    if (req.method === "POST") {
        const post = req.body;
        const mainHeading = post.main_heading;
        const subHeading = post.sub_heading;
        const content = post.content;

        // Check for the number of uploaded files
        if (!req.files || Object.keys(req.files).length === 0) {
            message = "At least one image is required.";
            return res.render('index.ejs', { message: message }); // Pass the message variable to the template
        }

        const uploadedImage1 = req.files.uploaded_image1;
        const uploadedImage2 = req.files.uploaded_image2;



        if (!uploadedImage1) {
            message = "Profile Image1 is required.";
            return res.render('index.ejs', { message: message });
        }

        // Function to check if the file is a valid image
        const isValidImage = (file) => {
            const validImageFormats = ['image/jpeg', 'image/png', 'image/gif'];
            return validImageFormats.includes(file.mimetype);
        };

        // Check if uploadedImage1 is a valid image
        if (!isValidImage(uploadedImage1)) {
            message = "Profile Image1 must be in JPEG, PNG, or GIF format.";
            return res.render('index.ejs', { message: message });
        }

        // If uploadedImage2 exists, check if it's a valid image
        if (uploadedImage2 && !isValidImage(uploadedImage2)) {
            message = "Profile Image2 must be in JPEG, PNG, or GIF format.";
            return res.render('index.ejs', { message: message });
        }




        

        uploadedImage1.mv('public/images/upload_images/' + uploadedImage1.name, function(err) {
            if (err) {
                return res.status(500).send(err);
            }

            let sql;
            if (uploadedImage2) {
                // If uploaded_image2 exists, it's optional
                uploadedImage2.mv('public/images/upload_images/' + uploadedImage2.name, function(err) {
                    if (err) {
                        return res.status(500).send(err);
                    }

                    sql = "INSERT INTO `users_image`(`main_heading`, `sub_heading`, `content`, `image1`, `image2`) VALUES ('" + mainHeading + "','" + subHeading + "','" + content + "','" + uploadedImage1.name + "','" + uploadedImage2.name + "')";
                    executeAndRedirect(sql);
                });
            } else {
                // If uploaded_image2 doesn't exist
                sql = "INSERT INTO `users_image`(`main_heading`, `sub_heading`, `content`, `image1`) VALUES ('" + mainHeading + "','" + subHeading + "','" + content + "','" + uploadedImage1.name + "')";
                executeAndRedirect(sql);
            }
        });
    } else {
        res.render('index', { message: message }); // Pass the message variable to the template
    }

    function executeAndRedirect(sql) {
        const query = db.query(sql, function(err, result) {
            res.redirect('profile/' + result.insertId);
        });
    }
};

exports.profile = function(req, res) {
    let message = '';
    const id = req.params.id;
    const sql = "SELECT * FROM `users_image` WHERE `id`='" + id + "'"; 
    db.query(sql, function(err, result) {
        if (result.length <= 0) {
            message = "Profile not found!";
        }
        res.render('profile.ejs', { data: result, message: message });
    });
};

