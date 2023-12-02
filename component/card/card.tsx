import styled from "styled-components";
import noImage from "../../public/images/card/no-image.svg";
import star from "../../public/images/card/star.png";
import kebab from "../../public/images/card/kebab.svg";
import { useState } from "react";
import { CardItem } from "../../utils/type";
import Image from "next/image";

interface CardProps {
    item: CardItem;
    setClose?: React.Dispatch<React.SetStateAction<boolean>>;
    setTag?: React.Dispatch<React.SetStateAction<string>>;
    close?: boolean;
}

interface CardsProps {
    items: CardItem[];
    setClose?: React.Dispatch<React.SetStateAction<boolean>>;
    setTag?: React.Dispatch<React.SetStateAction<string>>;
    close?: boolean;
}

function Card({ item, setClose, setTag, close }: CardProps) {
    const [status, setStatus] = useState(true);
    const bg = {
        backgroundImage: `url(${item.imageSource ?? noImage})`,
    };

    function handlePopOver(tag: string) {
        setStatus(!status);
        if (setClose !== undefined && setTag !== undefined) {
            setClose(!close);
            setTag(tag);
        }
    }

    const apiDate = new Date(item.createdAt as string);
    function dateCalculator(apiDate: Date) {
        const myDate = new Date();
        const elapsedMinute = Math.floor(
            (myDate.valueOf() - apiDate.valueOf()) / 1000 / 60
        );
        const elapsedHour = Math.floor(
            (myDate.valueOf() - apiDate.valueOf()) / 1000 / 60 / 60
        );
        const elapsedDays = Math.floor(
            (myDate.valueOf() - apiDate.valueOf()) / 1000 / 60 / 60 / 24
        );
        const elapsedMonth = Math.floor(
            (myDate.valueOf() - apiDate.valueOf()) / 1000 / 60 / 60 / 24 / 31
        );
        const elapsedYear = Math.floor(
            (myDate.valueOf() - apiDate.valueOf()) /
                1000 /
                60 /
                60 /
                24 /
                31 /
                12
        );

        if (elapsedMinute < 60) {
            if (elapsedMinute < 2) {
                return `1 minute ago`;
            }
            return `${elapsedMinute} minute${elapsedMinute ? "s" : ""} ago`;
        }
        if (elapsedHour < 24) {
            return `${elapsedHour} hour${elapsedHour ? "s" : ""} ago`;
        }
        if (elapsedDays < 31) {
            return `${elapsedDays} day${elapsedDays ? "s" : ""} ago`;
        }
        if (elapsedMonth < 12) {
            return `${elapsedMonth} month${elapsedMonth ? "s" : ""} ago`;
        }
        if (elapsedYear) {
            return `${elapsedYear} year${elapsedYear ? "s" : ""} ago`;
        }
    }
    const elapsedTime = dateCalculator(apiDate);
    const year = apiDate.getFullYear();
    const month = apiDate.getMonth() + 1;
    const days = apiDate.getDate();
    return (
        <StyledCardBox>
            <StyledHoverImg>
                <Image src={star} alt="star" />
            </StyledHoverImg>
            <a href={item.url} target="_blank" rel="noopener noreferrer">
                <StyledCardImg $bg={item.imageSource ?? noImage} />
            </a>
            <StyledTextBox>
                <StyledHoverImg onClick={() => setStatus(!status)}>
                    <Image src={kebab} alt="kebab" />
                </StyledHoverImg>
                <StyledPopOverBox $status={status}>
                    <StyledPopOver onClick={() => handlePopOver("deleteLink")}>
                        삭제하기
                    </StyledPopOver>
                    <StyledPopOver onClick={() => handlePopOver("add")}>
                        폴더에 추가
                    </StyledPopOver>
                </StyledPopOverBox>
                <div>{elapsedTime}</div>
                <StyledDescription>{item.description}</StyledDescription>
                <div>{`${year}. ${month}. ${days}`}</div>
            </StyledTextBox>
        </StyledCardBox>
    );
}

export default function Cards({ items, setClose, setTag, close }: CardsProps) {
    if (items === undefined) return;
    const camelItems = items.map((item) => {
        const newItem = { ...item };
        if ("created_at" in newItem && "image_source" in newItem) {
            if (
                typeof newItem.created_at === "string" ||
                typeof newItem.image_source === "string"
            ) {
                newItem.createdAt = newItem.created_at;
                delete newItem.created_at;
                newItem.imageSource = newItem.image_source!;
                delete newItem.image_source;
            }
        }
        return newItem;
    });
    console.log(camelItems);
    return (
        <StyledCardGrid>
            {camelItems.map((item) => (
                <Card
                    key={item.id}
                    item={item}
                    setClose={setClose}
                    setTag={setTag}
                    close={close}
                />
            ))}
        </StyledCardGrid>
    );
}

const StyledHoverImg = styled.div`
    position: absolute;
    top: 15px;
    right: 15px;
    cursor: pointer;
`;

const StyledDescription = styled.div`
    text-overflow: ellipsis;
    white-space: normal;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    color: #000;
`;

const StyledTextBox = styled.div`
    display: flex;
    padding: 15px 20px;
    flex-direction: column;
    gap: 10px;
    position: relative;
`;

const StyledCardBox = styled.div`
    width: 340px;
    background-color: #fff;
    border-radius: 15px;
    position: relative;
`;

const StyledCardImg = styled.div<{ $bg: string }>`
    overflow: hidden;
    width: 340px;
    height: 253.746px;
    background-image: url(${({ $bg }) => $bg});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 15px 15px 0px 0px;
    &:hover {
        background-size: 160%;
    }
`;

const StyledCardGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 25px 20px;
    @media (max-width: 767px) {
        grid-template-columns: 1fr;
        gap: 20px 0;
        margin: 0 32px;
        align-items: center;
        justify-items: center;
    }
    @media (min-width: 768px) and (max-width: 1124px) {
        grid-template-columns: repeat(2, 1fr);
        gap: 24px 25px;
        margin: 0 32px;
        align-items: center;
        justify-items: center;
    }
`;

const StyledPopOverBox = styled.div<{ $status: boolean }>`
    background-color: #fff;
    display: flex;
    width: 100px;
    flex-direction: column;
    gap: 2px;
    box-shadow: 0px 2px 8px 0px rgba(51, 50, 54, 0.1);
    position: absolute;
    top: 30px;
    right: -60px;
    z-index: 1;
    text-align: center;
    display: ${({ $status }) => ($status ? "none" : "")};
`;

const StyledPopOver = styled.div`
    padding: 7px 12px;
    font-size: 14px;
    &:hover {
        background-color: #e7effb;
        color: #6d6afe;
    }
    cursor: pointer;
`;