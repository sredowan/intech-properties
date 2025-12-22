<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// valid extensions
$valid_extensions = array('jpeg', 'jpg', 'png', 'gif', 'webp'); 
$upload_dir = 'uploads/'; // upload directory relative to this script

if(!file_exists($upload_dir)){
    mkdir($upload_dir, 0777, true);
}

if(isset($_FILES['image']))
{
    $img = $_FILES['image']['name'];
    $tmp = $_FILES['image']['tmp_name'];
    
    // get uploaded file's extension
    $ext = strtolower(pathinfo($img, PATHINFO_EXTENSION));
    
    // can upload same image using rand function
    $final_image = rand(1000,1000000).'_'.preg_replace('/[^a-z0-9.]/i', '_', $img);
    
    // check's valid format
    if(in_array($ext, $valid_extensions)) 
    { 
        $target_path = $upload_dir.strtolower($final_image); 
            
        if(move_uploaded_file($tmp, $target_path)) 
        {
            // Determine the base URL dynamically
            // If the script is at /subdir/upload.php, we want /subdir/uploads/filename.jpg
            $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off' ? 'https' : 'http';
            $host = $_SERVER['HTTP_HOST'];
            $script_dir = dirname($_SERVER['SCRIPT_NAME']);
            
            // Ensure script_dir starts with / and ends with /
            // dirname('/') returns '\' on windows or '/' on linux. normalize it.
            $script_dir = str_replace('\\', '/', $script_dir);
            if ($script_dir === '.') $script_dir = '';
            if (substr($script_dir, -1) !== '/') $script_dir .= '/';
            if (substr($script_dir, 0, 1) !== '/') $script_dir = '/' . $script_dir;

            $final_url = $script_dir . $upload_dir . strtolower($final_image);
            
            // Cleanup double slashes if any
            $final_url = preg_replace('#/+#', '/', $final_url);

            echo json_encode([
                "success" => true,
                "url" => $final_url,
                "filename" => strtolower($final_image)
            ]);
        } else {
             echo json_encode([
                "success" => false, 
                "error" => "Failed to move uploaded file."
            ]);
        }
    } 
    else 
    {
        echo json_encode([
            "success" => false, 
            "error" => "Invalid file extension. Allowed: ".implode(', ', $valid_extensions)
        ]);
    }
}
else
{
    echo json_encode([
        "success" => false, 
        "error" => "No file uploaded."
    ]);
}
?>
