#include <iostream>
#include <string>

#define SEARCH "github.com"
#define REPLACE "raw.githubusercontent.com"

std::string get_raw(const std::string &url, const std::string &search, const std::string &replace) {
	std::string raw_url = url;
	size_t pos = 0;

	while ((pos = raw_url.find(search, pos)) != std::string::npos) {
		raw_url.replace(pos, search.length(), replace);
		pos += replace.length();
	}

	return raw_url;
}

int main(int argc, const char **argv) {	
	if (argc != 2) {
		std::cout << "Usage: " << argv[0] << " <url>" << std::endl;
		return 1;
	}
	
	std::string url = *(argv + 1);
	std::string raw_url = get_raw(url, SEARCH, REPLACE);
	raw_url = get_raw(raw_url, "/blob", "");
	std::cout << "Converted URL: " << raw_url << std::endl;
	
	return 0;
}

