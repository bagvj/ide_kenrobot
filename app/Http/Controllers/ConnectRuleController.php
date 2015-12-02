<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Robot\Components;
use App\Robot\ConnectRule;
use Illuminate\Http\Request;

class ConnectRuleController extends Controller {
	/**
	 *
	 */
	public function getMatchComponent(Request $request) {
		$name_en = $request->input('name');

		$connectRuleData = ConnectRule::where('name_en', $name_en)->first(['name_en', 'name_cn', 'cid', 'link', 'bits']);

		if ($connectRuleData !== null) {
			$connectRuleData->cid;
			$componentData = Components::find($connectRuleData->cid);

			$needle = '';
			for ($i = 0; $i < intval($connectRuleData->bits); $i++) {
				$needle .= '1';
			}

			$link = $connectRuleData->link;

			$port_bit_1 = $componentData['port_bit_1'];
			$port_position_1 = $componentData['port_position_1'];
			$port_name_1 = $componentData['port_name_1'];
			$port_bit_2 = $componentData['port_bit_2'];
			$port_position_2 = $componentData['port_position_2'];
			$port_name_2 = $componentData['port_name_2'];
			$port_bit_3 = $componentData['port_bit_3'];
			$port_position_3 = $componentData['port_position_3'];
			$port_name_3 = $componentData['port_name_3'];
			$port_bit_4 = $componentData['port_bit_4'];
			$port_position_4 = $componentData['port_position_4'];
			$port_name_4 = $componentData['port_name_4'];
			$port_bit_5 = $componentData['port_bit_5'];
			$port_position_5 = $componentData['port_position_5'];
			$port_name_5 = $componentData['port_name_5'];
			$port_bit_6 = $componentData['port_bit_6'];
			$port_position_6 = $componentData['port_position_6'];
			$port_name_6 = $componentData['port_name_6'];
			$port_bit_7 = $componentData['port_bit_7'];
			$port_position_7 = $componentData['port_position_7'];
			$port_name_7 = $componentData['port_name_7'];
			$port_bit_8 = $componentData['port_bit_8'];
			$port_position_8 = $componentData['port_position_8'];
			$port_name_8 = $componentData['port_name_8'];

			// 端口信息确认
			if (strlen($link) != strlen($port_bit_1 . $port_bit_2 . $port_bit_3 . $port_bit_4 . $port_bit_5 . $port_bit_6 . $port_bit_7 . $port_bit_8)) {
				continue;
			}

			// 将连线规则中位信息根据控制器连线规则进行匹配，link_bit_* 就是 port_bit_* 的规则
			$link_bit_1 = substr($link, 0, strlen($port_bit_1));
			$link_bit_2 = substr($link, strlen($port_bit_1), strlen($port_bit_2));
			$link_bit_3 = substr($link, strlen($port_bit_1 . $port_bit_2), strlen($port_bit_3));
			$link_bit_4 = substr($link, strlen($port_bit_1 . $port_bit_2 . $port_bit_3), strlen($port_bit_4));
			$link_bit_5 = substr($link, strlen($port_bit_1 . $port_bit_2 . $port_bit_3 . $port_bit_4), strlen($port_bit_5));
			$link_bit_6 = substr($link, strlen($port_bit_1 . $port_bit_2 . $port_bit_3 . $port_bit_4 . $port_bit_5), strlen($port_bit_6));
			$link_bit_7 = substr($link, strlen($port_bit_1 . $port_bit_3 . $port_bit_3 . $port_bit_4 . $port_bit_5 . $port_bit_6), strlen($port_bit_7));
			$link_bit_8 = substr($link, strlen($port_bit_1 . $port_bit_2 . $port_bit_3 . $port_bit_4 . $port_bit_5 . $port_bit_6 . $port_bit_7), strlen($port_bit_8));

			for ($i = 1; $i < 9; $i++) {
				$tmpLinkBit = "link_bit_$i";
				if (strpos($$tmpLinkBit, $needle) !== false) {
					$portName = "port_name_$i";
					$tmpArrControllerRule[] = array(
						'name' => $$portName,
						'bits' => $$tmpLinkBit,
					);
				}
			}

			return collect([$connectRuleData->cid => $tmpArrControllerRule])->toJson(JSON_UNESCAPED_UNICODE);
		}

		return collect([])->toJson();
	}
}
