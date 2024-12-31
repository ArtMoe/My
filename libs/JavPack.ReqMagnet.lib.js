class ReqMagnet extends Req {
  static btdig(code) {
    const REG = /\s/g;
    const HOST = "https://btdig.com";

    return this.tasks(
      {
        url: `${HOST}/search`,
        params: { q: code },
        headers: {
          "Referer": `${HOST}/index.htm`,
          "Sec-Fetch-Dest": "document",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-Site": "same-origin",
          "Sec-Fetch-User": "?1",
          "Upgrade-Insecure-Requests": "1",
        },
      },
      [
        (dom) => {
          return [...dom.querySelectorAll(".one_result")]
            .map((item) => {
              return {
                name: item.querySelector(".torrent_name").textContent,
                url: item.querySelector(".torrent_magnet a").href,
                size: item.querySelector(".torrent_size").textContent.replace(REG, ""),
                files: item.querySelector(".torrent_files")?.textContent ?? "1",
                date: item.querySelector(".torrent_age").textContent,
              };
            })
            .filter(({ name }) => name.toUpperCase().includes(code));
        },
      ],
    );
  }

  static sukebei(code) {
    const REG = /\s/g;
    const HOST = "https://sukebei.nyaa.si";

    return this.tasks(
      {
        url: `${HOST}/?f=0&c=0_0&q=${code}`,
        headers: {
          "Referer": HOST,
          "Sec-Fetch-Dest": "document",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-Site": "same-origin",
          "Sec-Fetch-User": "?1",
          "Upgrade-Insecure-Requests": "1",
        },
      },
      [
        (dom) => {
          return [...dom.querySelectorAll(".table-responsive table tbody tr")]
            .map((item) => {
              return {
                name: item.querySelector("td:nth-child(2) a").textContent,
                url: item.querySelector("td:nth-child(3) a:last-child").href,
                size: item.querySelector("td:nth-child(4)").textContent,
                date: item.querySelector("td:nth-child(5)").textContent.split(" ")[0],
                href: item.querySelector("td:nth-child(2) a").getAttribute("href"),
              };
            })
            .filter(({ name }) => name.toUpperCase().includes(code));
        },
      ],
    );
  }
}
