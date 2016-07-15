<?php

namespace App\Util;

class Tools {

	//生成短url
	//返回：一个长度为6的由字母和数组组成的字符串
	public static function getHash($value = "") {
		$key = "HwpGAejoUOPr6DbKBlvRILmsq4z7X3TCtky8NVd5iWE0ga2MchSZxfn1Y9JQuF";

		$result = array();
		$time = time();
		$salt = md5(rand(10000, 99999));
		$md5 = md5($salt . $value . $time);

		for($i = 0; $i < 4; $i++) {
			$hex = 0x3FFFFFFF & intval(substr($md5, $i * 8, 8), 16);
			$out = '';
			for($j = 0; $j < 6; $j++) {
				$index = 0x0000003D & $hex;
				$out = $out . $key[$index];
				$hex = $hex >> 5;
			}
			$result[$i] = $out;
		}

		return $result[0];
	}

	public static function filterBuildOutput($output, $path) {
		$start = 0;
		$end = 0;
		for($i = 0; $i < count($output); $i++) {
		    $line = $output[$i];
		    if(strpos($line, "in <module>") !== false) {
		        $start = $i;
		    }
		    if(strpos($line, "scons: ***") !== false) {
		        $end = $i;
		    }
		    $output[$i] = str_replace($path . "/src/", "", $line);
		}
		return array_merge(array_slice($output, $start + 1, $end - $start - 1), array_slice($output, $end + 2));
	}
}