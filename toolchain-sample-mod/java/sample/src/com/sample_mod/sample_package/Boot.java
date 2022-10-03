package com.sample_mod.sample_package;

import java.util.HashMap;

import com.zhekasmirnov.horizon.runtime.logger.Logger;

public class Boot {
	public static void boot(HashMap<String, String> sources) {
		Logger.debug("TEST_MOD", "Hello from Java");
	}
}
