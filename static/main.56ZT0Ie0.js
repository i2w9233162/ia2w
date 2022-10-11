const form_input = document.querySelector('.input-form__input');
const form_button = document.querySelector('.input-form__button');
const text_area = document.querySelector('.textarea-wordpress');
text_area.value = '';
const copy_all_btn = document.querySelector('.copy-all');

const toggle_form_input = (status) => {
    if (status) {
        form_input.disabled = status;
        form_button.classList.toggle('cursor-not-allowed', true);
        form_button.classList.toggle('opacity-50', true);
        form_button.disabled = status;
    } else {
        form_input.disabled = status;
        form_button.classList.toggle('cursor-not-allowed', false);
        form_button.classList.toggle('opacity-50', false);
        form_button.disabled = status;
    }
};

document.querySelector('.input-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const is_valid_link = form_input.value.match(/imgur\.com\/a\/(\w+)/);

    if (is_valid_link) {
        text_area.value = '';

        toggle_form_input(true);

        let rawResponse;
        try {
            rawResponse = await fetch('/album_id', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({album_id: is_valid_link[1]})
            });
        } catch (error) {
            toggle_form_input(false);
            text_area.value = 'Album không tồn tại';
        }

        if (!rawResponse.ok) {
            toggle_form_input(false);
            text_area.value = 'Album không tồn tại';
            return;
        }

        const content = await rawResponse.json();

        text_area.value = `<div style="display:flex;flex-direction:column;justify-content:center;width:100%;">
${content.imgs_tag.join('\n')}
</div>`

        toggle_form_input(false);
    }
})

copy_all_btn.addEventListener('click', () => {
    text_area.select();
    text_area.setSelectionRange(0, 99999);

    navigator.clipboard.writeText(text_area.value);
})