"use strict";
window.onload = function () {
    let ratings = [];
    const byId = (id) => {
        const res = document.getElementById(id);
        if (res === null) {
            throw new Error(`No element with id ${id}.`);
        }
        return res;
    };
    const query = (selector) => {
        const res = document.querySelector(selector);
        if (res === null) {
            throw new Error(`No element matching selector ${selector}.`);
        }
        return res;
    };
    const queryAll = (selector) => [...document.querySelectorAll(selector)];
    const fillStars = (elem, rating) => {
        const stars = [...elem.querySelectorAll(".review-star")];
        if (stars.length !== 5) {
            throw new Error("element must have 5 stars as children");
        }
        stars.forEach(star => star.classList.remove("fa", "fa-star", "fa-star-o", "fa-star-half-o"));
        let i = 0;
        for (i = 0; i < Math.min(Math.floor(rating), stars.length); ++i) {
            stars[i].classList.add("fa", "fa-star");
        }
        if (i >= stars.length) {
            return;
        }
        const fpart = rating - Math.floor(rating);
        if (fpart >= 0.25 && fpart <= 0.75) {
            stars[i].classList.add("fa", "fa-star-half-o");
            i++;
        }
        else if (fpart > 0.75) {
            stars[i].classList.add("fa", "fa-star");
            i++;
        }
        for (; i < stars.length; ++i) {
            stars[i].classList.add("fa", "fa-star-o");
        }
    };
    const appendReview = (name, rating, review) => {
        const date = new Date();
        const dateString = `${date.getMonth().toString().padStart(2, "0")}/${date.getDay().toString().padStart(2, "0")}/${date.getFullYear()}`;
        const rev = document.createElement("div");
        rev.classList.add("w-100", "col", "p-m");
        rev.innerHTML = `
        <div class="w-100 row p-s m-s">
            <div class="review-stars">
                <span class="review-star"></span>
                <span class="review-star"></span>
                <span class="review-star"></span>
                <span class="review-star"></span>
                <span class="review-star"></span>
            </div>
            <span class="m-s">${name} on ${dateString}</span>
        </div>
        <p class="w-100 m-s p-m">${review}</p>
        `;
        fillStars(rev.querySelector(".review-stars"), rating);
        ratings.push(rating);
        const avg = ratings.reduce((a, c) => a + c) / ratings.length;
        byId("rating-avg-text").innerText = `${avg.toFixed(1)} out of 5`;
        fillStars(byId("rating-avg-stars"), avg);
        byId("reviews").appendChild(rev);
        rev.scrollIntoView();
    };
    let selectedRating = 0;
    const editStars = [...byId("rating-new-stars").querySelectorAll(".review-star")].map(x => x);
    const resetStars = () => {
        editStars.filter((_, ind) => ind < Math.floor(selectedRating)).forEach(e2 => {
            e2.classList.remove("fa", "fa-star", "fa-star-o", "fa-star-half-o");
            e2.classList.add("fa", "fa-star");
        });
        editStars.filter((_, ind) => ind > Math.floor(selectedRating)).forEach(e2 => {
            e2.classList.remove("fa", "fa-star", "fa-star-o", "fa-star-half-o");
            e2.classList.add("fa", "fa-star-o");
        });
        if (Math.floor(selectedRating) >= 5) {
            return;
        }
        const e3 = editStars[Math.floor(selectedRating)];
        e3.classList.remove("fa", "fa-star", "fa-star-o", "fa-star-half-o");
        const diff = selectedRating - Math.floor(selectedRating);
        if (diff < 0.25) {
            e3.classList.add("fa", "fa-star-o");
        }
        else if (diff < 0.75) {
            e3.classList.add("fa", "fa-star-half-o");
        }
        else {
            e3.classList.add("fa", "fa-star");
        }
    };
    editStars.forEach((elem, i) => {
        elem.onmousemove = e => {
            const rect = elem.getBoundingClientRect();
            const [left, right] = [rect.left, rect.right];
            const width = right - left;
            elem.classList.remove("fa", "fa-star", "fa-star-o", "fa-star-half-o");
            if (i > 0 && e.x - left < width / 2) {
                elem.classList.add("fa", "fa-star-half-o");
            }
            else {
                elem.classList.add("fa", "fa-star");
            }
            editStars.filter((_, ind) => ind < i).forEach(e2 => {
                e2.classList.remove("fa", "fa-star", "fa-star-o", "fa-star-half-o");
                e2.classList.add("fa", "fa-star");
            });
            editStars.filter((_, ind) => ind > i).forEach(e2 => {
                e2.classList.remove("fa", "fa-star", "fa-star-o", "fa-star-half-o");
                e2.classList.add("fa", "fa-star-o");
            });
        };
        elem.onmouseout = resetStars;
        elem.onclick = e => {
            const rect = elem.getBoundingClientRect();
            const [left, right] = [rect.left, rect.right];
            const width = right - left;
            if (i > 0 && e.x - left < width / 2) {
                selectedRating = i + 0.5;
            }
            else {
                selectedRating = i + 1;
            }
            resetStars();
        };
    });
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const flash = async (e) => {
        e.classList.add("flashing");
        await delay(500);
        e.classList.remove("flashing");
    };
    byId("post-review-button").onclick = () => {
        const name = byId("name").value;
        let reviewGood = true;
        if (name == null || name.trim() === "") {
            flash(byId("name"));
            reviewGood = false;
        }
        if (selectedRating < 1) {
            flash(byId("rating-new-stars"));
            reviewGood = false;
        }
        if (!reviewGood) {
            return;
        }
        const review = byId("review").value;
        appendReview(name, selectedRating, review);
        selectedRating = 0;
        resetStars();
        byId("name").value = "";
        byId("review").value = "";
    };
};
//# sourceMappingURL=script.js.map