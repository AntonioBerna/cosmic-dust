#include <iostream>
#include <string>

std::string get_raw(const std::string &url, const std::string *searches, const std::string *replaces, size_t num_searches) {
	std::string raw_url = url;

	for (size_t i = 0; i < num_searches; ++i) {
		size_t pos = 0;
		const std::string &search = searches[i];
		const std::string &replace = replaces[i];

		while ((pos = raw_url.find(search, pos)) != std::string::npos) {
			raw_url.replace(pos, search.length(), replace);
			pos += replace.length();
		}
	}

	return raw_url;
}

int main(int argc, const char **argv) {
	if (argc != 2) {
		std::cout << "Usage: " << *argv << " <url>" << std::endl;
		return 1;
	}

	const std::string searches[] = {
		"github.com",
		"/blob"
	};

	const std::string replaces[] = {
		"raw.githubusercontent.com",
		""
	};
	
	std::string url = *(argv + 1);
	size_t num_searches = sizeof(searches) / sizeof(searches[0]);
	
	std::string raw_url = get_raw(url, searches, replaces, num_searches);
	std::cout << "Converted URL: " << raw_url << std::endl;
	
	return 0;
}
