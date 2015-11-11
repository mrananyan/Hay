<?php
include("ArmStyle.php");
$arm = new ArmStyle;
$arm->dir = 'Design/';
$arm->front_end('index.arm');
$arm->display('{design}', '/Design');
$arm->display('{Logo}', 'Հայաստան');
$arm->compile('content');
eval (' ?' . '>' . $arm->result['content'] . '<' . '?php ');  // Վերջ :D
?>
