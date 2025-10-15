<?php
$row_count = $_GET['row_count'];
$col_count = $_GET['col_count'];
$cells = $row_count * $col_count;
//if there's less than 10 cells, all will be on
$result = [];
if ($cells<=10){
    $cell_count = 0;
    while ($cell_count<$cells){
        array_push($result, [$cell_count => "on"]);
        $cell_count++;
    }
}
//otherwise get 10 random values
else{
    $rand_values = [];
    while (count($rand_values)< 10){
        $found = false;
        while (!$found){
            $value= rand(0,$cells);
            if (!in_array($value,$rand_values)){
                array_push($rand_values, $value);
                $found = true;
            }
        }
    }
    $cell_count = 0;
    while ($cell_count<$cells){
        if (!in_array($cell_count,$rand_values)){
            array_push($result, [$cell_count => "off"]);
        }
        else{
            array_push($result, [$cell_count => "on"]);
        }
        $cell_count++;
    }
}
header('Content-Type: application/json');
echo json_encode($result);
?>