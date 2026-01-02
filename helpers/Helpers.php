<?php

    // A class for constructing helper tasks..
    class Helpers {

        // () -> to handle the dynamic update tasks..
        // i.e., it takes two of the parameters as input when it is used
        // 1. An Assoc Array for updation..
        // 2. Name of relation/ table..
        public static function handleUpdate(array $updateData, string $table) {

            // an array of valid columns per table..
            $validColumns = [
                "users" => ["id", "first_name", "last_name", "username", "email", "phone_number", "role", "bio", "gender", "profile_image", "is_active"]
            ];

            // get the id for update..
            $id = $updateData["id"] ?? null;

            // when id not given..
            if(!$id) {
                return [
                    "status" => false,
                    "message" => "id is missing for update"
                ];
            }

            // check for table name.
            if(!in_array($table, ["users", "topics"])) {

                return [
                    "status" => false,
                    "message" => "invalid relation/ table name."
                ];
            }

            // remove the id from data*
            unset($updateData["id"]);

            // initial statement and params..
            $statement = "UPDATE $table SET ";
            $parameters = [];

            // initial updates
            $updates = [];

            // process the data for update..
            foreach($updateData as $key => $value) { 

                // check for valid column names
                if(!in_array($key, $validColumns[$table], true)) {
                    
                    // when encounters unknown column for update..
                    return [
                        "status" => false,
                        "message" => "invalid column: $key"
                    ];
                }

                // check for actual data for update..
                if($value === null 
                    || 
                $value === "" 
                ) {
                    // skip them..
                    continue;
                }

                // set the statement for update
                $updates[] = "$key = :$key";

                // bind the parameters.. 
                $parameters[$key] = $value;
            }

            // check if data is there for update..
            if(empty($updates)) {

                return [
                    "status" => false,
                    "message" => "no data for update"
                ];
            }

            // add updated at time..
            $updates[] = "updated_at = :updated_at";

            // set the statement..
            $statement .= implode(", ", $updates);
            $statement .= " WHERE id = :id AND deleted_at is null";

            // at the end bind id
            $parameters["id"] = $id;
            $parameters["updated_at"] = date("Y-m-d H:i:s");

            // check log..
            // var_dump($statement);
            // var_dump($parameters);

            // get the data to update..
            return [
                "parameters" => $parameters,
                "statement" => $statement
            ];
        }
 
        // () -> sanitization of executed output..
        public static function sanitizeExecOutput(?string $output): string {

            // initial output..
            $output = $output ?? "";

            // check log..
            // var_dump($output);
            // die();

            // initial indexes..
            $start = false;
            $end = false;

            // check if output contains "in" and "on line"
            if(str_contains($output, " in ")) {
                $start = strpos($output, " in ");
            }

            if(str_contains($output, " on line ")) {
                $end = strpos($output, " on line ");
            }

            // check if start and end exist..
            if($start !== false && $end !== false && $end > $start) {

                // get the trimmed output..
                return substr($output, 0, $start) . substr($output, $end);
            }

            // otherwise no change..
            return trim($output);
        }

        // () -> handle the sanitization and execution of incoming code..
        public static function handleCode(string $input): array {

            // path for php execution engine..
            $pathToExec = "C:\\laragon\\bin\\php\\php-8.3.26-Win32-vs16-x64\\php.exe";

            // trim up the input..
            $input = trim($input);

            // a temp file..
            $tempFile = tempnam(sys_get_temp_dir(), "php_play_");

            // in case when file creation fails..
            if($tempFile === false) {
                return [
                    "std_out" => "",
                    "std_err" => "Execution File Creation failed",
                    "execution_status" => "runtime_error"
                ];
            }

            // check log..
            // var_dump($tempFile);

            // attach <?php syntax to it..
            $content = "<?php\n" . $input;

            // save the content in the file..
            file_put_contents($tempFile, $content);

            // execute the content from the file..
            // 2>&1 flag allows to capture the errors and warning
            $outcome = shell_exec("\"$pathToExec\" $tempFile 2>&1");

            // check log..
            // var_dump($outcome);

            // destroy the file..
            unlink($tempFile);

            // sanitize the output from exec..
            $sanitizedOutput = Helpers::sanitizeExecOutput($outcome);

            // check log/ stop..
            // var_dump($sanitizedOutput);
            
            // has error..
            $isError = 
                stripos($sanitizedOutput, "parse error") !== false ||
                stripos($sanitizedOutput, "fatal error") !== false ||
                stripos($sanitizedOutput, "warning") !== false ||
                stripos($sanitizedOutput, "notice") !== false;

            // when error
            if($isError) {
                return [
                    "std_out" => "",
                    "std_err" => $sanitizedOutput,
                    "execution_status" => "runtime_error"
                ];
            }

            // get the outcome as expected..
           return [
                "std_out" => $sanitizedOutput === '' ? 'No Output' : trim($sanitizedOutput),
                "std_err" => "",
                "execution_status" => "success"
           ];
        }

        // () -> check for code from client..
        public static function getFullCode(string $code) {

            // get the code other than function declaration and body..
            $cleanCode = preg_replace(
                '/function\s+\w+\s*\([^)]*\)\s*\{[\s\S]*?\}/',
                '',
                $code
            );

            // otherwise get the clean code..
            return trim($cleanCode);
        }
    }

    // TEST
    // $data = [
    //     "first_name" => "xyz",
    //     "profile_image" => "",
    //     "id" => "1"
    // ];

    // $table = "users";

    // check log..
    // $check = Helpers::handleUpdate($data, $table);
    // var_dump($check["statement"], $check["parameters"]);


    // 2. sanitize and execute php code..
    
    // grab the data..
    // $incomingCode = <<<'PHP'
    //     echo $d;
    // PHP;

    // () -> sanitize and handle execution code..
    // var_dump(Helpers::handleCode($incomingCode));

    // var_dump(shell_exec("php -v"));
?>