import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getUniqueAttributes(elem: Element) {
    const allowedAttributes = [
        "id",
        "class",
        "name",
        "type",
        "role",
        "href",
        "src",
    ];

    const dataAttributes = Array.from(elem.attributes).filter(
        (attr) =>
            attr.name.startsWith("data-") || attr.name.startsWith("aria-"),
    );

    const uniqueAttributes: Record<string, string[]> = {};

    Array.from(elem.attributes).forEach((attr) => {
        if (
            allowedAttributes.includes(attr.name) ||
            dataAttributes.some((dataAttr) => dataAttr.name === attr.name)
        ) {
            if (attr.name === "class") {
                // Split class attribute values into an array
                uniqueAttributes[attr.name] = attr.value
                    .split(" ")
                    .filter(Boolean);
            } else {
                // Wrap other attributes in an array
                uniqueAttributes[attr.name] = [attr.value];
            }
        }
    });

    return uniqueAttributes;
}
